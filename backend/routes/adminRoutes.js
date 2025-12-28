const express = require('express');
const router = express.Router();
const {
    createUser,
    getUsers,
    verifyAlumni,
    activateUser,
    createDepartment,
    getDepartments,
    updateUser,
    deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

router.post('/create-user', createUser);
router.get('/users', getUsers);
router.put('/verify-alumni/:id', verifyAlumni);
router.put('/activate-user/:id', activateUser);
router.put('/update-user/:id', updateUser);
router.delete('/delete-user/:id', deleteUser);

router.post('/create-department', createDepartment);
router.get('/departments', getDepartments);

module.exports = router;
