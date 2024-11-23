const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/ratingController')

router.post('/', ratingController.setRating)
router.get('/', ratingController.getRating)
router.get('/average/:deviceId', ratingController.getAverageRating)

module.exports = router
