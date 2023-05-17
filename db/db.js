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
    plantName,
    plantNickName,
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
    // device_id 를 realtime table 에서 가져옴
    const getDeviceSQL = `SELECT device_id FROM realtime ORDER BY created_at desc LIMIT 1;`;
    const [deviceId] = await this.promisePool.query(getDeviceSQL);
    const device_id = deviceId[0];

    if (!device_id || device_id === "") {
      return Error("디바이스를 연결해주세요");
    } else {
      const sql = `INSERT INTO device_data (device_id, plantName, plantNickName, created_at, memo, potDiameter, potHeight, plantDiameter, plantHeight, region, temperature, humid, soil) values (?,?,?,?,?,?,?,?,?,?,?,?,?);`;
      const [rows] = await this.promisePool.query(sql, [
        device_id,
        plantName,
        plantNickName,
        DEFAULT,
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
  }
  async getDeviceId() {
    const getDeviceSQL = `SELECT device_id FROM realtime ORDER BY created_at desc LIMIT 1;`;
    const [deviceId] = await this.promisePool.query(getDeviceSQL);
    const device_id = deviceId[0];
    return device_id;
  }

  // 2) 모든 디바이스 리스트 조회
  async getDevices() {
    const sql = `SELECT plantName, plantNickName FROM device_data;`;
    const [rows] = await this.promisePool.query(sql);
    return rows;
  }

  // 3) 한 개 디바이스 정보 조회
  async getOneDevice(device_id) {
    const sql = `SELECT * FROM device_data WHERE device_id=?;`;
    const [rows] = await this.promisePool.query(sql, [device_id]);
    return rows;
  }
  // 4) 한 개 디바이스 정보 수정
  async putOneDevice(
    plantName,
    plantNickName,
    memo,
    potDiameter,
    potHeight,
    plantDiameter,
    plantHeight,
    region,
    temperature,
    humid,
    soil,
    device_id
  ) {
    const sql = `UPDATE device_data set plantName=?, plantNickName=?, memo=?, potDiameter=?, potHeight=?, plantDiameter=?, plantHeight=?, region=?, temperature=?, humid=? WHERE device_id=?;`;
    const [rows] = await this.promisePool.query(sql, [
      plantName,
      plantNickName,
      memo,
      potDiameter,
      potHeight,
      plantDiameter,
      plantHeight,
      region,
      temperature,
      humid,
      soil,
      device_id,
    ]);
    return rows;
  }
  // 5) 한 개 디바이스 정보 삭제
  async deleteOneDevice(device_id) {
    const sql = `DELETE device_data WHERE device_id=?;`;
    const [rows] = await this.promisePool.query(sql, [device_id]);
    return rows;
  }
}

export default DB;
