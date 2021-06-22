import { Router } from 'express'

import controller from '../controllers/registerLinks'

import auth from '../middleware/auth'
import role from '../middleware/role'

import { Roles } from '../types'

const router = Router()

router.post('/', auth, role(Roles.Admin), controller.create)
router.get('/', auth, role(Roles.Admin), controller.getAll)
router.get('/:link', controller.getByLink)
router.delete('/:id', auth, role(Roles.Admin), controller.remove)

export default router