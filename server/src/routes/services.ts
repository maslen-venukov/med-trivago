import { Router } from 'express'

import controller from '../controllers/services'

import auth from '../middleware/auth'
import role from '../middleware/role'

import { Roles } from '../types'

const router = Router()

router.post('/', auth, role(Roles.Hospital), controller.create)
router.get('/', controller.getAll)
router.get('/hospital', auth, role(Roles.Hospital), controller.getByHospital)
router.get('/:id', controller.getById)
router.delete('/:id', auth, role(Roles.Hospital), controller.remove)

export default router