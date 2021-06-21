import { Router } from 'express'

import controller from '../controllers/services'

import auth from '../middleware/auth'

const router = Router()

router.get('/', controller.getAll)
router.get('/hospital', auth, controller.getByHospital)
router.get('/:id', controller.getById)

export default router