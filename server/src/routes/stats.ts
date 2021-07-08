import { Router } from 'express'

import controller from '../controllers/stats'

const router = Router()

router.get('/count', controller.getCount)

export default router