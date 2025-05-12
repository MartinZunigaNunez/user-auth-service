import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        // valido que este todo
        if(!username || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obli...'});
        }

        // encripto la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        //Creo el usuario
        const newUser = await createUser({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Usuario creado exitosamente',
            user:{
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
          }
        
        const user = await findUserByEmail(email);
        if(!user){
            return res.status(401).json({ error: 'Credenciales invalidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).json({ error: 'Credenciales inválidas' });

        }

        //Creo el TOKEN

        const token = jwt.sign({
            id: user.id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h'}
        );

        res.json({
            message: 'Login exitoso',
            token
        });

    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
}