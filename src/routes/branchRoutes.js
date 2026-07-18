const express = require('express');
const branchController = require('../controllers/branchController');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { createBranchSchema, updateBranchSchema } = require('../validators/branchValidators');

const router = express.Router();

router.get('/', branchController.getBranches);
router.post('/', requireAuth, validate(createBranchSchema), branchController.createBranch);
router.put('/:id', requireAuth, validate(updateBranchSchema), branchController.updateBranch);
router.delete('/:id', requireAuth, branchController.deleteBranch);

module.exports = router;
