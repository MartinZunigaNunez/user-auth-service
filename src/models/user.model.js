import { getConnection } from '../config/db.js';

export async function createUser({username, email, password}) {
    const db = await getConnection();
     //Verificamos que el email no existe
     const existingByEmail = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
     if (existingByEmail) {
        throw new Error('El email ya está en uso');
    }

    const existingByUsername = await db.get(`SELECT * FROM users WHERE username = ?`, [username]);
    if (existingByUsername) {
        throw new Error('El nombre de usuario ya está en uso');
    }

    const result = await db.run(
        `INSERT INTO users (username, email, password) VALUES ( ?, ?, ?)`, [username, email, password]
    );

    return {
        id: result.lastID,
        username,
        email
    }
}

export async function findUserByEmail(email) {
    const db = await getConnection();
    return await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    
}

export async function findUserByUsername(username) {
    const db = await getConnection();
    return await db.get(`SELECT * FROM users WHERE email = ?`, [username]);

}

export async function findUserById(id) {
    const db = await getConnection();
    return await db.get(`SELECT * FROM users WHERE email = ?`, [id]);

}

 