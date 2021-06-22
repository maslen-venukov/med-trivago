import { Router } from 'express'

import controller from '../controllers/services'

import auth from '../middleware/auth'

const router = Router()

router.post('/', auth, controller.create)
router.get('/', controller.getAll)
router.get('/hospital', auth, controller.getByHospital)
router.get('/:id', controller.getById)
router.delete('/:id', auth, controller.remove)

export default router