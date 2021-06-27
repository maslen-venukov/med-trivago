import { Router } from 'express'

import controller from '../controllers/appointments'

import auth from '../middleware/auth'
import role from '../middleware/role'

import { Roles } from '../types'

const router = Router()

router.post('/', controller.create)
router.get('/', auth, role(Roles.Hospital), controller.getByHospital)
router.get('/appointed-dates/:serviceId', controller.getAppointedDates)

export default router