// src/config/db.js

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

// Esto es necesario porque __dirname no está disponible en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta absoluta para la base de datos
const dbPath = path.resolve(__dirname, '../../database.sqlite');

let db = null;

// Obtener una conexión a la base de datos
export async function getConnection() {
  if (db) return db;

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.run('PRAGMA foreign_keys = ON');
  return db;
}

// Probar la conexión
export async function testConnection() {
  try {
    const conn = await getConnection();
    await conn.get('SELECT 1');
    console.log('Conexión a SQLite establecida correctamente');
    console.log(`Base de datos localizada en: ${dbPath}`);
    return true;
  } catch (error) {
    console.error('Error al conectar con SQLite:', error);
    return false;
  }
}

// Inicializar la base de datos (crear tablas y triggers)
export async function initDatabase() {
  try {
    const conn = await getConnection();

    await conn.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'user')) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.exec(`
      CREATE TRIGGER IF NOT EXISTS update_timestamp
      AFTER UPDATE ON users
      BEGIN
        UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END;
    `);

    console.log('Tablas SQLite inicializadas correctamente');
    return true;
  } catch (error) {
    console.error('Error al inicializar la base de datos SQLite:', error);
    return false;
  }
}

// Cerrar la conexión
export async function closeConnection() {
  if (db) {
    await db.close();
    db = null;
    console.log('Conexión a SQLite cerrada');
  }
}
