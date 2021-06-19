import { Router } from 'express'

import controller from '../controllers/registerLinks'

import auth from '../middleware/auth'

const router = Router()

router.post('/', auth, controller.create)
router.get('/:link', controller.getByLink)

export default router