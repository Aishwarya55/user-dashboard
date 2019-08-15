import { Router } from 'express'
import controller from './dashboard.controller'

const router = Router()

// /api/list
router
  .route('/')
  .get(controller.getAll)
  .post(controller.createOne)

export default router
