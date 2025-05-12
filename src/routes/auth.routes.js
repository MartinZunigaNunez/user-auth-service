import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';


const router = Router();

//Registro
router.post('/register', register);
//Login
router.post('/login', login);

router.get('/test', (req, res) => {
    res.json({ message: 'Test route is working' });
})

export default router;