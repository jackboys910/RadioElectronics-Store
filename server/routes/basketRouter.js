const Router = require('express')
const router = new Router()
const basketController = require('../controllers/basketController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/add', authMiddleware, basketController.addDevice)
router.get('/', authMiddleware, basketController.getBasket)
router.delete('/clear', authMiddleware, basketController.clearBasket)
router.post('/purchase', authMiddleware, basketController.createTransaction)
router.delete('/:id', authMiddleware, basketController.removeDevice)

module.exports = router
