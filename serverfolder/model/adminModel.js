const db = require('../database/db')
const createTableAdmin = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
    await db.execute(query);
};


const insertAdmin = async (email, password) => {
    const query = 'INSERT INTO admin (email, password) VALUES (?,?)';
    const [result] = await db.execute(query, [email, password]);
    return result.insertId;
};


const getAdminByEmail = async (email) => {
    const query = 'SELECT * FROM admin WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
};

module.exports = {
    insertAdmin,
    createTableAdmin,
    getAdminByEmail,
   
};
