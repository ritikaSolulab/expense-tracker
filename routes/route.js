const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');


router.post('/api/categories', controller.create_Categories)
router.get('/api/categories', controller.get_Categories)

router.post('/api/transaction', controller.create_Transaction)
router.get('/api/transaction', controller.get_Transaction)
router.put('/api/transaction/:id', controller.delete_Transaction)

router.get('/api/labels', controller.get_Labels)

module.exports = router;