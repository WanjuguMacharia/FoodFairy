const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');


router.get('/', beneficiaryController.viewBeneficiaries)
router.get('/addBeneficiary', beneficiaryController.newBeneficiary)
router.post('/addBeneficiary', beneficiaryController.createBeneficiary)









module.exports = router