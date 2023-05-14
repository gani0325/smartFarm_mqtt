import mysql from "mysql2";

class DB {
  constructor({ host, user, post, password, database }) {
    this.pool = mysql.createPool({
      host,
      user,
      post,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
    });
    console.log(host, user, post, password, database);
    this.promisePool = this.pool.promise();
  }

  // 1) 식물 데이터 넣기
  async insertData({
    device_id,
    plantName,
    plantNickName,
    created_at,
    memo,
    potDiameter,
    potHeight,
    plantDiameter,
    plantHeight,
    region,
    temperature,
    humid,
    soil,
  }) {
    const sql = `INSERT INTO device_data (device_id, plantName, plantNickName, created_at, memo, potDiameter, potHeight, plantDiameter, plantHeight, region, temperature, humid, soil) values (?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    const [rows] = await this.promisePool.query(sql, [
      device_id,
      plantName,
      plantNickName,
      created_at,
      memo,
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

  async getLatestData() {
    // 2) 실시간 데이터 조회
    const sql = `SELECT * FROM device_data WHERE idx IN(SELECT MAX(idx) idx FROM device_data);`;
    const [rows] = await this.promisePool.query(sql);
    return rows;
  }

  async getDevices() {
    // 3) 디바이스 리스트 조회
    const sql = `SELECT device_id FROM device_data;`;
    const [rows] = await this.promisePool.query(sql);
    return rows;
  }

  async getOneDevice(device_id) {
    // 4) 디바이스 정보 조회
    const sql = `SELECT * FROM device_data WHERE device_id=?;`;
    const [rows] = await this.promisePool.query(sql, [device_id]);
    return rows;
  }

  async getData(device_id, start, end) {
    // 5) 히스토리 데이터 조회
    const sql = `SELECT * FROM device_data WHERE device_id=? and (created_at BETWEEN ? AND ?);`;
    const [rows] = await this.promisePool.query(sql, [device_id, start, end]);
    return rows;
  }
}

export default DB;
