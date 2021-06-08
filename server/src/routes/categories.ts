import { Router } from 'express'

import controller from '../controllers/categories'
import auth from '../middleware/auth'

const router = Router()

router.post('/', auth, controller.create)
router.get('/', controller.getAll)
router.put('/:id', auth, controller.update)
router.delete('/:id', auth, controller.remove)

export default router