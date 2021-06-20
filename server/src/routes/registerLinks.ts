import { Router } from 'express'

import controller from '../controllers/registerLinks'

import auth from '../middleware/auth'

const router = Router()

router.post('/', auth, controller.create)
router.get('/', auth, controller.getAll)
router.get('/:link', controller.getByLink)
router.delete('/:id', auth, controller.remove)

export default router