import { Router } from 'express'

import controller from '../controllers/appointments'

import auth from '../middleware/auth'
import role from '../middleware/role'
import objectId from '../middleware/objectId'

import { Roles } from '../types'

const router = Router()

router.post('/', controller.create)
router.get('/', auth, role(Roles.Hospital), controller.getByHospital)
router.put('/:id', auth, role(Roles.Hospital), objectId(), controller.update)
router.delete('/:id', auth, role(Roles.Hospital), objectId(), controller.remove)

export default router