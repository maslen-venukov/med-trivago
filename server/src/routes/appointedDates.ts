import { Router } from 'express'

import controller from '../controllers/appointedDates'

import auth from '../middleware/auth'
import role from '../middleware/role'
import objectId from '../middleware/objectId'

import { Roles } from '../types'

const router = Router()

router.post('/:serviceId', auth, role(Roles.Hospital), objectId('serviceId'), controller.create)
// router.get('/:serviceId', objectId('serviceId'), controller.getByService)

export default router