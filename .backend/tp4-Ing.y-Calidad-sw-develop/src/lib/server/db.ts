import postgres from 'postgres';
/// importar la variable de entorno de forma segura 
import { DATABASE_URL } from '$env/static/private'; 

/// inicializar la conexión usando la variable protegida
export const sql = postgres(DATABASE_URL);