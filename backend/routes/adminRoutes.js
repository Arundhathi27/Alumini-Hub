const express = require('express');
const router = express.Router();
const multer = require('multer');

// Multer config for memory storage (processing Excel in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    createUser,
    getUsers,
    verifyUser,
    activateUser,
    createDepartment,
    getDepartments,
    updateUser,
    deleteUser,
    bulkUploadUsers,
    bulkVerifyUsers,
    bulkDeleteUsers
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

router.post('/create-user', createUser);
router.get('/users', getUsers);
router.put('/verify-user/:id', verifyUser);
router.put('/activate-user/:id', activateUser);
router.put('/update-user/:id', updateUser);
router.delete('/delete-user/:id', deleteUser);

router.post('/create-department', createDepartment);
router.get('/departments', getDepartments);

// Bulk Upload Route
router.post('/bulk-upload', upload.single('file'), bulkUploadUsers);

// Bulk Verify Route
router.post('/users/bulk-verify', bulkVerifyUsers);

// Bulk Delete Route
router.delete('/users/bulk-delete', bulkDeleteUsers);

module.exports = router;
