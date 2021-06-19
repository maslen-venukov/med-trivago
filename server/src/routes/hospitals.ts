import { Router } from 'express'

import controller from '../controllers/hospitals'
import auth from '../middleware/auth'

const router = Router()

router.post('/', controller.create)
router.get('/', auth, controller.getAll)

export default router