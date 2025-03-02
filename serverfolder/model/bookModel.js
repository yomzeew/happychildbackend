const mysql = require('mysql2');
const pool = require('../database/db');
const rateget=require('../contoller/appsettingcontroller')

const createBookingTable = async () => {
    const query = `CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        childid INT NOT NULL,
        parentid INT NOT NULL,
        phonenumber VARCHAR(15),
        checkin DATE NOT NULL,
        checkout DATE NOT NULL,
        schedulepattern VARCHAR(10) NOT NULL,
        timeslots JSON NOT NULL,
        rate DECIMAL(10, 2) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_status BOOLEAN NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    await pool.execute(query);

}
const tableExists = async (tableName) => {
    const query = `
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema = 'happychild'
        AND table_name = ?`;
    const [results] = await pool.query(query, [tableName]);
    return results[0]['COUNT(*)'] > 0;
};

const createTime = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS available_hours (
            id INT AUTO_INCREMENT PRIMARY KEY,
            timeinterval VARCHAR(11) NOT NULL UNIQUE,
            bookings INT DEFAULT 0,
            datereg DATE NULL,
            reg_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )`;
    await pool.execute(query);
};

const dropTable = async () => {
    const query = `DROP TABLE IF EXISTS available_hours`;
    await pool.execute(query);
};
const getrate=async(agegroup)=>{
    const result=await rateget.getrate(agegroup)
    return parseFloat(result[0].rate)

}


const insertTime = async () => {
    try {
        const exists = await tableExists('available_hours');
        if (!exists) {
            console.log('Table does not exist, creating...');
            await createTime();
        } else {
            const selectregoftable = `SELECT reg_date FROM available_hours WHERE id=1`;
            const [rows] = await pool.execute(selectregoftable);
            const getdaterow = rows[0].reg_date;

            console.log(rows[0]);
            const getTodayTime = Date.now();
            const getDatabaseTime = Date.parse(getdaterow);
            const today = new Date(getTodayTime);
            const databaseDate = new Date(getDatabaseTime);
            const isSameDay = today.getFullYear() === databaseDate.getFullYear() &&
                today.getMonth() === databaseDate.getMonth() &&
                today.getDate() === databaseDate.getDate();
            
            console.log('Are the dates the same day?', isSameDay);
            if (!isSameDay) {
                await dropTable();
                await createTime();
            } else {
                console.log('Table exists and dates are the same.');
            }
        }

        const intervals = [
            '00:00-01:00', '01:00-02:00', '02:00-03:00', '03:00-04:00',
            '04:00-05:00', '05:00-06:00', '06:00-07:00', '07:00-08:00',
            '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
            '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
            '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00',
            '20:00-21:00', '21:00-22:00', '22:00-23:00', '23:00-00:00'
        ];

        const [existingIntervals] = await pool.query(`SELECT timeinterval FROM available_hours WHERE timeinterval IN (?)`, [intervals]);
        const existingIntervalSet = new Set(existingIntervals.map(row => row.timeinterval));
        const newIntervals = intervals.filter(interval => !existingIntervalSet.has(interval));

        if (newIntervals.length > 0) {
            const values = newIntervals.map(interval => [interval, 1]);
            const sql = `INSERT INTO available_hours (timeinterval, bookings) VALUES ?`;
            await pool.query(sql, [values]);
        }
    } catch (error) {
        console.log(error);
    }
}
const getAvailableHours = async () => {
    await insertTime()
    const sql = 'SELECT timeinterval, bookings FROM available_hours';
    const [rows] = await pool.query(sql);
    return rows;
};



const updateBookingCount = async (interval) => {
    try {
        const sql = `UPDATE available_hours SET bookings = bookings + 1 WHERE timeinterval = ?`;
        await pool.query(sql, [interval]);
    } catch (error) {
        throw error;
    }
};

const bookTimeSlots = async (child_id, parent_id, phone_number, check_in, check_out, schedule_pattern, time_slots) => {
    await createBookingTable()
    try {
        for (let interval of time_slots) {
            await updateBookingCount(interval);
        }

        const totalHours = time_slots.length;
        const getagegroup='SELECT * FROM childtable WHERE id=?'
        const [rows]=await pool.query(getagegroup,[child_id])
        console.log(rows[0].agegroup)
        const result=await rateget.getrate(rows[0].agegroup)
        const getratefromdb=result.data
        const RATE_PER_HOUR=parseFloat(getratefromdb[0].rate)
        const totalCost = totalHours * RATE_PER_HOUR * schedule_pattern;
        const payment_status=false

        // Save booking details along with the total cost to the database
        const bookingSql = `
            INSERT INTO bookings (childid, parentid, phonenumber, checkin, checkout, schedulepattern, timeslots,rate, amount,payment_status)
            VALUES (?, ?, ?, ?, ?, ?,?,?, ?,?)
        `;
        const [insertid]=await pool.query(bookingSql, [child_id, parent_id, phone_number, check_in, check_out, schedule_pattern, JSON.stringify(time_slots),RATE_PER_HOUR, totalCost,payment_status]);
        console.log(insertid.insertId)
        const returnValue={totalCost:totalCost,insertid:insertid.insertId}
        return returnValue;
    } catch (error) {
        throw error;
    }
};
const getbookingByid=async(id)=>{
    const querySql=`SELECT bookings.*, CONCAT(parent_user.firstname, ' ', parent_user.lastname) AS fullname, CONCAT(child_user.firstname, ' ', child_user.lastname) AS child_fullname FROM bookings INNER JOIN users AS parent_user ON bookings.parentid = parent_user.id INNER JOIN childtable AS child_user ON bookings.childid = child_user.id WHERE bookings.id =?`
    const [rows]=await pool.query(querySql,[id])
    return rows

}
const getbookingByparentid=async(id)=>{
    const querySql=`SELECT bookings.*, CONCAT(child_user.firstname, ' ', child_user.lastname) AS child_fullname FROM bookings INNER JOIN childtable AS child_user ON bookings.childid = child_user.id WHERE bookings.parentid =?`
    const [rows]=await pool.query(querySql,[id])
    return rows

}
const getbookingByall=async()=>{
    const querySql=`SELECT bookings.*, CONCAT(child_user.firstname, ' ', child_user.lastname) AS child_fullname, CONCAT(parenttable.firstname, ' ', parenttable.lastname) AS parent_fullname FROM bookings INNER JOIN childtable AS child_user ON bookings.childid = child_user.id INNER JOIN users AS parenttable ON child_user.parentid = parenttable.id`
    const [rows]=await pool.query(querySql)
    return rows

}
const updatePayment=async(id)=>{
    const querySql=`UPDATE bookings SET payment_status = true WHERE id=?`
    const [result] = await pool.query(querySql, [id]);
    return result.affectedRows;
}
const getdefaulter=async()=>{
    const querysql=`SELECT`
}

module.exports = {getAvailableHours, updateBookingCount, bookTimeSlots,getbookingByid,getbookingByparentid,getbookingByall,updatePayment,createBookingTable};
