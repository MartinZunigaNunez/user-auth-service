import { initDatabase, testConnection } from './src/config/db.js';

await initDatabase();
await testConnection();
