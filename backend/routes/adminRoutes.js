const express = require('express');
const router = express.Router();
const multer = require('multer');

// Multer config for memory storage (processing Excel in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    createUser,
    getUsers,
    verifyAlumni,
    activateUser,
    createDepartment,
    getDepartments,
    updateUser,
    deleteUser,
    bulkUploadUsers
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

// Bulk Upload Route
router.post('/bulk-upload', upload.single('file'), bulkUploadUsers);

module.exports = router;
