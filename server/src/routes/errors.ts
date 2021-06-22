import { Router } from 'express'

import controller from '../controllers/errors'

import auth from '../middleware/auth'
import role from '../middleware/role'

import { Roles } from '../types'

const router = Router()

router.get('/', auth, role(Roles.Admin), controller.getAll)

export default router