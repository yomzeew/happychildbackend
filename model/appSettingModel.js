const db = require('../database/db')
const createNumberofkid = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS numberofkids (
      id INT AUTO_INCREMENT PRIMARY KEY,
      numberofkid VARCHAR(11) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
    )
  `;
    await db.execute(query);
};
const createRate = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS amountrate (
      id INT AUTO_INCREMENT PRIMARY KEY,
      agegroup VARCHAR(11)  NOT NULL,
      rate VARCHAR(11) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
    await db.execute(query);
};
const getpaymentrate=async()=>{
    const query = `
    CREATE TABLE IF NOT EXISTS paymentdetails (
      id INT AUTO_INCREMENT PRIMARY KEY,
      bankname VARCHAR(250)  NOT NULL,
      accountno VARCHAR(15) NOT NULL,
      sortcode VARCHAR(15)  NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    await db.execute(query);
}
const contacttable=async()=>{
    const query = `
    CREATE TABLE IF NOT EXISTS contactcenter (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullname VARCHAR(250)  NOT NULL,
      email VARCHAR(150) NOT NULL,
      subject VARCHAR(250)  NULL,
      message VARCHAR(500) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    await db.execute(query);
}


const insertkidnumber = async (noofkids) => {
    try{
        await createNumberofkid()
        const selectquery='SELECT * FROM numberofkids WHERE id=1'
        const [rows]=await db.execute(selectquery)
        if (rows.length>0){
            const query='UPDATE numberofkids SET numberofkid=? WHERE id = 1';
            const [result] = await db.execute(query, [noofkids]);
            return {
                message: 'successful',
            }; 
        }
        else{
            const query = 'INSERT INTO numberofkids (numberofkid) VALUES (?)';
            const [result] = await db.execute(query, [noofkids]);
            return {
                message: 'successful',
            };
    
        }

    }catch(error){
        return {
            error: true,
            message: error.message,
        };

    }
   
   
};
const insertamountrate = async (agegroup,rate) => {
    try {
    await createRate()
    const selectquery='SELECT * FROM amountrate WHERE agegroup=?'
    const [rows]=await db.execute(selectquery,[agegroup])
    console.log(rows)
    if (rows.length>0){
        const query='UPDATE amountrate SET rate=? WHERE agegroup = ?';
        const [result] = await db.execute(query, [agegroup,rate]);
        return {
            message: 'successful',
        };

    }
    else{
        const query = 'INSERT INTO amountrate (agegroup,rate) VALUES (?,?)';
        const [result] = await db.execute(query, [agegroup,rate]);
        return {
            message: 'successful',
        };

    }
}catch(error){
    return {
        error: true,
        message: error.message,
    };
}
   
};
const getnoofkid= async () => {
    await createNumberofkid()
    const sql = 'SELECT * FROM  numberofkids WHERE id=1';
    const [rows] =  await db.execute(sql);
    return rows;
};
const getamountrate= async (agegroup) => {
    await createRate()
    const sql = 'SELECT * FROM  amountrate WHERE agegroup=?';
    const [rows] = await db.execute(sql,[agegroup]);
    return rows;
};
const getamountrateall= async () => {
    await createRate()
    const sql = 'SELECT * FROM  amountrate';
    const [rows] = await db.execute(sql);
    return rows;
};
const insertBankdetail=async(bankname,accountno,sortcode)=>{
    try {
        await getpaymentrate()
        const selectquery='SELECT * FROM paymentdetails WHERE id=1'
        const [rows]=await db.execute(selectquery)
        console.log(rows)
        if (rows.length>0){
            const query='UPDATE paymentdetails SET bankname=?, accountno=?, sortcode=? WHERE id = 1';
            const [result] = await db.execute(query, [bankname,accountno,sortcode]);
            return {
                message: 'successful',
            };
    
        }
        else{
            const query = 'INSERT INTO paymentdetails (bankname,accountno,sortcode) VALUES (?,?,?)';
            const [result] = await db.execute(query, [bankname,accountno,sortcode]);
            return {
                message: 'successful',
            };
    
        }
    }catch(error){
        return {
            error: true,
            message: error.message,
        };
}
}
const getbankdetails= async () => {
    await getpaymentrate()
    const sql = 'SELECT * FROM  paymentdetails ';
    const [rows] = await db.execute(sql);
    return rows;
};
const insertdatacenter=async(fullname,email,subject,message)=>{
    await contacttable()
    const query = 'INSERT INTO contactcenter (fullname,email,subject,message) VALUES (?,?,?,?)';
    const [result] = await db.execute(query, [fullname,email,subject,message]);
    return {
        message: 'successful',
    };
}






module.exports = {
    insertkidnumber,
    insertamountrate,
    getnoofkid,
    getamountrate,
    getamountrateall,
    insertBankdetail,
    getbankdetails,
    insertdatacenter,
};
