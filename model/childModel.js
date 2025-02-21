const db=require('../database/db')
const createTableChild = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS childtable (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstname VARCHAR(255)  NULL,
      lastname VARCHAR(255)  NULL,
      parentid INT(11) NOT NULL,
      dob VARCHAR(255) NOT NULL,
      age INT(6) NOT NULL,
      agegroup VARCHAR(100)  NULL,
      gender VARCHAR(25)  NULL,   
      assistance VARCHAR(500)  NULL
    )
  `;
    await db.execute(query);
};
const insertChild = async (firstname,lastname,parentid,dob,age,agegroup,gender,assistance) => {
    const query = 'INSERT INTO childtable (firstname,lastname,parentid,dob,age,agegroup,gender,assistance) VALUES (?,?,?,?,?,?,?,?)';
    const [result] = await db.execute(query, [firstname,lastname,parentid,dob,age,agegroup,gender,assistance]);
    return result.insertId;
};

const deleteChild = async (id) => {
    const query = 'DELETE FROM childtable WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows;
};

const updateChild = async (firstname,lastname,dob,age,agegroup,gender,assistance,id) => {
    const query = 'UPDATE childtable SET firstname=?,lastname=?,dob=?,age=?,agegroup=?,gender=?,assistance=? WHERE id = ?';

    const [result] = await db.execute(query, [firstname,lastname,dob,age,agegroup,gender,assistance,id]);
    return result.affectedRows;
};



const getchildByparentid = async (parentid) => {
    const query = 'SELECT * FROM `childtable` WHERE parentid = ?';
    const [rows] = await db.execute(query, [parentid]);
    return [rows];
};
const getUserByEmail = async (email) => {
    const query = 'SELECT * FROM childtable WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
};
const getAllChild=async()=>{
    const query=`SELECT c.*, CONCAT(u.firstname, ' ', u.lastname) AS parent_fullname FROM childtable c LEFT JOIN users u ON c.parentid = u.id;`
    const [rows] = await db.execute(query);
    return [rows];
}

module.exports={
    createTableChild,
    insertChild,
    getchildByparentid,
    deleteChild,
    updateChild,
    getAllChild,
}