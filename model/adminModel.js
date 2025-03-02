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
const createTableTestimony = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS testimonytable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tname VARCHAR(191) NOT NULL UNIQUE,
    testimony VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
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
const insertTestimony = async (tname, testimony, filename) => {
    const query = 'INSERT INTO testimonytable (tname, testimony, filename) VALUES (?, ?, ?)';
    const [result] = await db.execute(query, [tname, testimony, filename]);
    return result.insertId;
};

const getTestimonies = async () => {
    const query = 'SELECT id, tname, testimony, filename FROM testimonytable ORDER BY id DESC';
    const [rows] = await db.execute(query);
    return rows;
};

const deleteTestimonyById = async (id) => {
    const query = 'DELETE FROM testimonytable WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows; // Returns the number of deleted rows
};

module.exports = {
    insertAdmin,
    createTableAdmin,
    getAdminByEmail,
    getTestimonies,
    insertTestimony,
    deleteTestimonyById
   
};
