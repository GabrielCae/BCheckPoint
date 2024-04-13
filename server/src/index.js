// === Express Config and Import ===

const express = require('express')
const app = express()

app.use(express.json())

// === Other libraries import ===

const bcrypt = require('bcrypt')

// === Controllers ===
const { CreateUserController } = require('./controllers/user')
const UserController = new CreateUserController()

// === Auxiliar Functions ===
const validHHMMstring = (str) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(str);

// === Main Code ===

app.post("/user/create", async (req, res) => {
    res.statusCode = 400
    try {
        if (!validHHMMstring(req.body.startTime)) {
            res.send("O horário que o usuário irá iniciar o trabalho não está em um formato válido.")
            return
        }

        if (await UserController.findByEmail({ email: req.body.email }) != null) {
            res.send("Email já cadastrado.")
            return
        }

        const d = new Date()
        d.setUTCHours(String(req.body.startTime).split(":")[0])
        d.setUTCMinutes(String(req.body.startTime).split(":")[1])

        const user = await UserController.handle({
            email: req.body.email,
            password: await bcrypt.hashSync("12345678", 10),
            name: req.body.name,
            startTime: d.toISOString()
        })

        console.log(user)

        res.statusCode = 200
        res.send("Usuário " + req.body.name + " criado com sucesso")
    } catch (e) {
        console.log(e)
        res.send("Não foi possível criar o usuário.")
    }
})

app.put("/user/:name", async (req, res) => {
    res.statusCode = 400
    const user = await UserController.findByEmail({ email: req.body.email })

    if (user == null) {
        res.send("Não foi possível encontrar um usuário com o email inserido.")
        return
    }

    try {
       await UserController.modify({
            id: user.id,
            email: req.body.email,
            
       })
    } catch (e) {
        console.log(e)    
        res.send(`Não foi possível editar o usuário solicitado. (Email: ${req.body.email})`)
    }
})

app.get("/user/:name", async (req, res) =>
    res.send(await UserController.findByName({
        name: req.params.name
    }))
)

app.get("/user/vacations/:vacationsMode", async (req, res) =>
    res.send(await UserController.filterByVacations({
        vacationsMode: req.params.vacationsMode === 'true'
    }))
)

app.listen(3000)
console.log("Server opened on port 3000")