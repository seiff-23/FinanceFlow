const express = require('express');
const { getBudget, saveBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getBudget);
router.post('/', saveBudget);

module.exports = router;
