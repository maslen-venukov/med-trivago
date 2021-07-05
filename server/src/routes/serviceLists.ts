import { Router } from 'express'

import controller from '../controllers/serviceLists'

import auth from '../middleware/auth'
import role from '../middleware/role'
import objectId from '../middleware/objectId'

import { Roles } from '../types'

const router = Router()

const middleware = [auth, role(Roles.Hospital), objectId('categoryId')]

router.post('/:categoryId', ...middleware, controller.create)
router.put('/:categoryId', ...middleware, controller.update)
router.delete('/:categoryId', ...middleware, controller.remove)

export default router