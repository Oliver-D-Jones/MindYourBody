import express from 'express'
import BaseController from "../utils/BaseController";
import auth0provider from "@bcwdev/auth0provider";
import { exercisesService } from '../services/ExercisesService'



//PUBLIC
export class ExercisesController extends BaseController {
  constructor() {
    super("api/exercises")
    this.router
      .use(auth0provider.getAuthorizedUserInfo)
      .get('', this.getAll)
      .get('/random', this.getRandomExercise)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.delete)
  }


  async getAll(req, res, next) {
    try {
      //only gets exercises by user who is logged in
      let data = await exercisesService.getAll()
      return res.send(data)
    }
    catch (err) { next(err) }
  }

  async getRandomExercise(req, res, next) {
    try {
      let data = await exercisesService.getRandomExercise(req)
      return res.send(data)
    } catch (error) { next(error) }
  }

  async create(req, res, next) {
    try {
      let data = await exercisesService.create(req.body)
      return res.status(201).send(data)
    } catch (error) { next(error) }
  }

  async edit(req, res, next) {
    try {
      let data = await exercisesService.edit(req.params.id, req.body)
      return res.send(data)
    } catch (error) { next(error) }
  }

  async delete(req, res, next) {
    try {
      await exercisesService.delete(req.params.id)
      return res.send("Successfully deleted")
    } catch (error) { next(error) }
  }
}


