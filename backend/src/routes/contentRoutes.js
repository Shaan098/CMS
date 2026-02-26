const express = require('express');
const {
  listContent,
  createContent,
  updateContent,
  submitForApproval,
  approveContent,
  removeContent
} = require('../controllers/contentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth);

router.get('/', listContent);
router.post('/', roleCheck('editor'), createContent);
router.put('/:id', roleCheck('editor'), updateContent);
router.post('/:id/submit', roleCheck('editor'), submitForApproval);
router.post('/:id/approve', roleCheck('approver'), approveContent);
router.delete('/:id', roleCheck('editor'), removeContent);

module.exports = router;
