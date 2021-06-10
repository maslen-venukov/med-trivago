import { Router } from 'express'

import controller from '../controllers/services'

const router = Router()

router.get('/', controller.getAll)

export default router