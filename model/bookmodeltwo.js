const mysql = require('mysql2');
const pool = require('../database/db');
const CreateTableInterval=async()=>{
    const query = `CREATE TABLE IF NOT EXISTS available_hourstwo (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timeandbooking VARCHAR(500) NOT NULL,
        regdate DATE NOT NULL,
    )`;
    await pool.execute(query);
}
const insertInterval=async(regdate)=>{
    const intervals = [
        { interval: '00:00-01:00', booking: 0 },
        { interval: '01:00-02:00', booking: 0 },
        { interval: '02:00-03:00', booking: 0 },
        { interval: '03:00-04:00', booking: 0 },
        { interval: '04:00-05:00', booking: 0 },
        { interval: '05:00-06:00', booking: 0 },
        { interval: '06:00-07:00', booking: 0 },
        { interval: '07:00-08:00', booking: 0 },
        { interval: '08:00-09:00', booking: 0 },
        { interval: '09:00-10:00', booking: 0 },
        { interval: '10:00-11:00', booking: 0 },
        { interval: '11:00-12:00', booking: 0 },
        { interval: '12:00-13:00', booking: 0 },
        { interval: '13:00-14:00', booking: 0 },
        { interval: '14:00-15:00', booking: 0 },
        { interval: '15:00-16:00', booking: 0 },
        { interval: '16:00-17:00', booking: 0 },
        { interval: '17:00-18:00', booking: 0 },
        { interval: '18:00-19:00', booking: 0 },
        { interval: '19:00-20:00', booking: 0 },
        { interval: '20:00-21:00', booking: 0 },
        { interval: '21:00-22:00', booking: 0 },
        { interval: '22:00-23:00', booking: 0 },
        { interval: '23:00-00:00', booking: 0 }
      ];
      //convert to string
      const intervalsString = JSON.stringify(intervals)
      //insert into database
      try{
      const query = `INSERT INTO available_hourstwo (timeandbooking, regdate) VALUES ?,?`
      await pool.query(sql, [intervalsString,regdate]);
      }
      catch(error){
        console.log(error)
      }



}