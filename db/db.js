import mysql from "mysql2";

class DB {
  constructor({ host, port, user, password, database }) {
    this.pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
    });
    this.promisePool = this.pool.promise();
  }

  // data insert
  async insertData({
    device_id,
    plantName,
    plantNickName,
    created_at,
    desc,
    potDiameter,
    potHeight,
    plantDiameter,
    plantHeight,
    region,
    temperature,
    humid,
    soil,
  }) {
    const sql = `INSERT INTO device_data (device_id, plantName, plantNickName, created_at, desc, potDiameter, potHeight, plantDiameter, plantHeight, region, temperature, humid, soil) values (?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    const [rows] = await this.promisePool.query(sql, [
      device_id,
      plantName,
      plantNickName,
      created_at,
      desc,
      potDiameter,
      potHeight,
      plantDiameter,
      plantHeight,
      region,
      temperature,
      humid,
      soil,
    ]);
    return rows;
  }
}

export default DB;
