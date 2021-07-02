import { Router } from 'express'

import controller from '../controllers/hospitals'

import auth from '../middleware/auth'
import role from '../middleware/role'
import objectId from '../middleware/objectId'

import { Roles } from '../types'

const router = Router()

router.post('/', controller.create)
router.get('/', auth, role(Roles.Admin), controller.getAll)
router.get('/user', auth, role(Roles.Hospital), controller.getByUser)
router.put('/', auth, role(Roles.Hospital), controller.update)
router.delete('/:id', auth, role(Roles.Admin), objectId(), controller.remove)

export default router