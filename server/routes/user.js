const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');


router.get('/', beneficiaryController.viewBeneficiaries)









module.exports = router