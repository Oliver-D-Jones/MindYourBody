import express from 'express'
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { playersService } from '../services/PlayersService'



//PUBLIC
export class PlayersController extends BaseController {
    constructor() {
        super("api/players")
        this.router
            //.use(auth0provider.getAuthorizedUserInfo)
            .get('', this.getAll)
            .get('/gettop', this.getTop)
            .get('/:id', this.getById)
            .post('', this.create)
            .put('/:id', this.edit)
            .delete('/:id', this.delete)
            .delete('', this.deleteAll)
    }


    async getAll(req, res, next) {
        try {
            let data = await playersService.getAll()
            return res.send(data)
        }
        catch (err) { next(err) }
    }

    async getTop(req, res, next) {
        try {
            let data = await playersService.getTop()
            return res.send(data)
        } catch (err) { next(err) }
    }

    async getById(req, res, next) {
        try {
            let data = await playersService.getById(req.params.id)
            return res.send(data)
        }
        catch (err) { next(err) }
    }

    async create(req, res, next) {
        try {
            let data = await playersService.create(req.body)
            return res.status(201).send(data)
        } catch (error) { next(error) }
    }

    async edit(req, res, next) {
        try {
            let data = await playersService.edit(req.params.id, req.body)
            return res.send(data)
        } catch (error) { next(error) }
    }

    async deleteAll(req, res, next) {
        try {
            await playersService.deleteAll()
            return res.send("all gone")
        } catch (error) { next(error) }
    }

    async delete(req, res, next) {
        try {
            await playersService.delete(req.params.id)
            return res.send("Successfully deleted")
        } catch (error) { next(error) }
    }
}
