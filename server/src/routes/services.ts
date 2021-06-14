import { Router } from 'express'

import controller from '../controllers/services'

const router = Router()

router.get('/', controller.getAll)
router.get('/:id', controller.getById)

export default router