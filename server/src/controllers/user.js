const { prismaClient } = require('./database/prismaClient')

class CreateUserController {
    async handle(arg) {
        const { email, password, name, startTime } = arg

        return await prismaClient.user.create({
            data: {
                email, password, name, startTime
            }
        })
    }

    async delete(arg) {
        const { id } = arg

        return await prismaClient.user.delete({
            where: {
                id
            }
        })
    }

    async list() {
        return await prismaClient.user.findMany()
    }

    async filterByHour(arg) {
        const { time } = arg
        
        return await prismaClient.user.findMany({
            where: {
                startTime: time,
            }
        })
    }

    async filterByVacations(arg) {
        const { vacationsMode } = arg

        return await prismaClient.user.findMany({
            where: {
                vacations: vacationsMode
            }
        })
    }

    async findById(arg) {
        const { id } = arg

        return await prismaClient.user.findUnique({
            where: {
                id
            }
        })
    }

    async findByName(arg) {
        const { name } = arg

        return await prismaClient.user.findMany({
            where: {
                name
            }
        })
    }

    async findByEmail(arg) {
        const { email } = arg

        return await prismaClient.user.findUnique({
            where: {
                email
            }
        })
    }

    async modify(arg) {
        const { id, email, password, name, startTime } = arg

        return await prismaClient.user.update({
            where: { id },
            data: { email, password, name, startTime }
        })
    }
}

module.exports = {
    CreateUserController
}