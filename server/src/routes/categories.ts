import { Router } from 'express'

import controller from '../controllers/categories'

import auth from '../middleware/auth'
import role from '../middleware/role'
import objectId from '../middleware/objectId'

import { Roles } from '../types'

const router = Router()

router.post('/', auth, role(Roles.Admin), controller.create)
router.get('/', controller.getAll)
router.put('/:id', auth, role(Roles.Admin), objectId(), controller.update)
router.delete('/:id', auth, role(Roles.Admin), objectId(), controller.remove)

export default router