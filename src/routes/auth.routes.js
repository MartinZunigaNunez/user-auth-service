import { Router } from 'express';
import { register, login, registerAdmin, getProfile } from '../controllers/auth.controller.js';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

//Registro
router.post('/register', register);
//Login
router.post('/login', login);

router.get('/test', (req, res) => {
    res.json({ message: 'Test route is working' });
})

router.get('/test2', authenticateToken, (req, res) => {
    res.json({
        message: 'Test2 route is working',
        user: req.user
    });
})

router.post('/create-admin', authenticateToken, registerAdmin)

router.get('/admin-panel', authenticateToken, isAdmin, (req, res) => {
    res.json({
        message: 'Admin panel is working',
        user: req.user
    });
});

router.get('/me', authenticateToken, getProfile);

export default router;