const db = require('../database/db')
const createTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstname VARCHAR(100) NULL,
  lastname VARCHAR(100) NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  occupation VARCHAR(100) NULL,
  phonenumber VARCHAR(25) NULL,
  address TEXT NULL,
  verificationstatus BOOLEAN NULL,
  otp VARCHAR(6) NULL,
  expireAt TIMESTAMP NULL
) CHARACTER SET utf8;

  `;
    await db.execute(query);
};


const insertUser = async (email, password,verificationstatus) => {
    const query = 'INSERT INTO users (email, password,verificationstatus) VALUES (?,?,?)';
    const [result] = await db.execute(query, [email, password,verificationstatus]);
    return result.insertId;
};

const deleteUser = async (id) => {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows;
};

const updateUser = async (id, firstname, lastname,occupation,address,phonenumber) => {
    const query = 'UPDATE users SET firstname = ?, lastname = ?, occupation = ?,address=?,phonenumber=? WHERE id = ?';

    const [result] = await db.execute(query, [firstname, lastname,occupation,address,phonenumber, id]);
    return result.affectedRows;
};
const updateUserStatus = async (id,verifcationstatus) => {
    const query = 'UPDATE users SET verificationstatus=? WHERE id = ?';
    const [result] = await db.execute(query, [verifcationstatus, id]);
    return result.affectedRows;
};
const updateUserOtp = async (id,otp,expireAt) => {
   const expireTime= new Date(expireAt).toISOString().slice(0, 19).replace('T', ' ');
    const query = 'UPDATE users SET otp=?,expireAt=? WHERE id = ?';
    const [result] = await db.execute(query, [otp,expireTime,id]);
    return result.affectedRows;
};
const updatePassword = async (email,password) => {
     const query = 'UPDATE users SET password=? WHERE email = ?';
     const [result] = await db.execute(query, [password,email]);
     return result.affectedRows;
 };

const getUserById = async (id) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};
const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
};
const getUserByIDonly = async (id) => {
    const query = 'SELECT lastname,firstname,email,occupation,phonenumber,address FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
};
const getAllUsers = async () => {
    const query = 'SELECT * FROM users';
    const [rows] = await db.execute(query);
    return rows;
};
const getAllUsersandChildmodel=async()=>{
    const query='SELECT p.*, COUNT(c.id) AS number_of_children FROM users p LEFT JOIN childtable c ON p.id = c.parentid GROUP BY p.id'
    const [rows]=await db.execute(query);
    return rows;

}

module.exports = {
    createTable,
    insertUser,
    deleteUser,
    updateUser,
    updatePassword,
    getUserById,
    getAllUsers,
    getUserByEmail,
    updateUserStatus,
    updateUserOtp,
    getUserByIDonly,
    getAllUsersandChildmodel,
};
