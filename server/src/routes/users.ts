import { Router } from 'express'

import controller from '../controllers/users'
import auth from '../middleware/auth'

const router = Router()

router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/auth', auth, controller.auth)

export default router