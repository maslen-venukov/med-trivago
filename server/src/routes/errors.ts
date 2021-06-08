import { Router } from 'express'

import controller from '../controllers/errors'
import auth from '../middleware/auth'

const router = Router()

router.get('/', auth, controller.getAll)

export default router