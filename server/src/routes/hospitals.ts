import { Router } from 'express'

import controller from '../controllers/hospitals'

import auth from '../middleware/auth'
import role from '../middleware/role'

import { Roles } from '../types'

const router = Router()

router.post('/', controller.create)
router.get('/', auth, role(Roles.Admin), controller.getAll)
router.delete('/:id', auth, role(Roles.Admin), controller.remove)

export default router