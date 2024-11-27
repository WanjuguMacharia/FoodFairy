const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const donorController = require('../controllers/donorController');


router.get('/', beneficiaryController.viewBeneficiaries)
// router.get('/:id', beneficiaryController.deleteBeneficiary)
router.get('/addBeneficiary', beneficiaryController.newBeneficiary)
router.post('/addBeneficiary', beneficiaryController.createBeneficiary)
router.get('/editBeneficiary/:id', beneficiaryController.editBeneficiary)
router.post('/editBeneficiary/:id', beneficiaryController.updateBeneficiary)


router.get('/donor', donorController.viewDonors);
router.get('/addDonor', donorController.newDonor);
router.post('/addDonor', donorController.createDonor);
router.get('/editDonor/:id', donorController.editDonor);
router.post('/editDonor/:id', donorController.updateDonor);










module.exports = router