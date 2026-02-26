const express = require('express');
const { listUsers, updateUserRole } = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth, roleCheck('admin'));
router.get('/', listUsers);
router.put('/:id/role', updateUserRole);

module.exports = router;
