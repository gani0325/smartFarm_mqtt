import mysql from 'mysql2';

class DB {
  constructor({host, user, password, database}){
    this.pool = mysql.createPool({
      host,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0
    });
    this.promisePool = this.pool.promise();
  }

  async insertData({device_id, temperature, humidity, created_at}){
    const sql = `INSERT INTO device_data (device_id, temperature, humidity, created_at) values (?,?,?,?);`;
    const [rows] = await this.promisePool.query(sql,[device_id, temperature, humidity, created_at]);
    return rows;
  }

  async getLatestData(){
    const sql = `SELECT * FROM device_data WHERE idx IN(SELECT MAX(idx) idx FROM device_data GROUP BY device_id);`;
    const [rows] = await this.promisePool.query(sql);
    return rows;
  }
}

export default DB