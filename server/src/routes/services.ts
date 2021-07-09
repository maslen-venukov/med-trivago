import { Router } from 'express'

import controller from '../controllers/services'

import auth from '../middleware/auth'
import role from '../middleware/role'
import objectId from '../middleware/objectId'

import { Roles } from '../types'

const router = Router()

router.post('/', auth, role(Roles.Hospital), controller.create)
router.get('/', controller.getAll)
router.get('/compare/:serviceName', controller.getCompare)
router.get('/hospital', auth, role(Roles.Hospital), controller.getByHospital)
router.get('/:id', objectId(), controller.getById)
router.put('/:id', auth, role(Roles.Hospital), objectId(), controller.update)
router.delete('/:id', auth, role(Roles.Hospital), objectId(), controller.remove)

export default router