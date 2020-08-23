import { dbContext } from "../db/DbContext"
import { BadRequest } from "../utils/Errors"


class PlayersService {
    async getAll() {
        return await dbContext.Players.find()
    }

    async getById(id) {
        let data = await dbContext.Players.findOne({ profileId: id })
        if (!data) {
            throw new BadRequest("no such player");
        }
        return data;
    }

    async getTop() {
        return await dbContext.Players.find().limit(10).sort({ points: -1 })
    }


    async create(rawData) {
        let data = await dbContext.Players.create(rawData)
        return data
    }

    async edit(id, update) {
        let data = await dbContext.Players.findOneAndUpdate({ profileId: id }, update)
        if (!data) {
            throw new BadRequest("no such player");
        }
        return data;
    }

    async deleteAll() {
        let data = await dbContext.Players.remove({});
        if (!data) {
            throw new BadRequest("no records")
        }

    }

    async delete(id) {
        let data = await dbContext.Players.findOneAndRemove({ _id: id });
        if (!data) {
            throw new BadRequest("Invalid ID or no such record");
        }
    }

}

export const playersService = new PlayersService()
