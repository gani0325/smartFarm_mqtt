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
  //front===========================
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
    // deviceId 를 realtime table 에서 가져옴
    const getDeviceSQL = `SELECT deviceId FROM device ORDER BY id desc LIMIT 1;`;
    const [device_id] = await this.promisePool.query(getDeviceSQL);
    const deviceId = device_id[0];

    const sql = `INSERT INTO device_data (deviceId, plantName, plantNickName, createdAt, memo, potDiameter, potHeight, plantDiameter, plantHeight, region, temperature, humid, soil) values (?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    const [rows] = await this.promisePool.query(sql, [
      deviceId,
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

  // 디바이스 아이디 받아오기
  async getDeviceId() {
    // deviceId 를 device table 에서 가져옴
    const getDeviceSQL = `SELECT deviceId FROM device ORDER BY id desc LIMIT 1;`;
    const [device_id] = await this.promisePool.query(getDeviceSQL);
    const deviceId = device_id[0];
    return deviceId;
  }

  // 2) 모든 디바이스 리스트 조회 (애칭으로 검색하면 디바이스 아이디, 애칭, 식물명 나오게)
  async getDevices() {
    console.log("Dhlsdfjhadfljsa;dfjasd;flasfd");

    const sql = `SELECT deviceId, plantName, plantNickName FROM device_data;`;
    const [rows] = await this.promisePool.query(sql);

    console.log(rows);

    return rows;
  }

  // 3) 한 개 디바이스 정보 조회
  async getOneDevice(deviceId) {
    const sql = `select * from device_data where deviceId = ?;`;
    const [rows] = await this.promisePool.query(sql, [deviceId]);
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
    deviceId
  ) {
    const sql = `UPDATE device_data set plantName=?, plantNickName=?, memo=?, potDiameter=?, potHeight=?, plantDiameter=?, plantHeight=?, region=?, temperature=?, humid=? WHERE deviceId=?;`;
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
      deviceId,
    ]);
    return rows;
  }

  // 5) 한 개 디바이스 정보 삭제
  async deleteOneDevice(deviceId) {
    const sql = `DELETE device_data WHERE deviceId=?;`;
    const [rows] = await this.promisePool.query(sql, [deviceId]);
    return rows;
  }

  //device===========================
  async insertDevice(deviceId) {
    const checkSQL = `select * from device where deviceId=${deviceId};`;
    const [checkRow] = await this.promisePool(checkSQL);

    if (checkRow == null) {
      const sql = `insert into device(deviceId) values(${deviceId});`;
      const [rows] = await this.promisePool.query(sql);
      return rows;
    } else {
      return "already exist";
    }
  }

  //realtime===========================
  // 실시간 데이터 저장
  async insertRealtimeData({ deviceId, temperature, humid, soil, createdAt }) {
    const getNameSQL = `select plantNickName from device_data where deviceId = ?;`;
    const [result] = await this.promisePool.query(getNameSQL, deviceId);
    const plantName = result[0];
    // const plant_name = "aaa";

    const sql = `insert into realtime values(?, ?, ?, ?, ?, ?);`;
    const [rows] = await this.promisePool.query(sql, [
      deviceId,
      plantName,
      temperature,
      humid,
      soil,
      createdAt,
    ]);
    return rows;
  }

  // 차트 만들기 위한 데이터 로그 불러오기 -> 가장 최근 12개
  async getRealtimes(deviceId) {
    const sql = `select * from realtime where deviceId=${deviceId} order by createdAt desc limit 12;`;
    const [rows] = await this.promisePool.query(sql);
    return rows;
  }

  async getRealtimeData(deviceId) {
    const sql = `select * from realtime where deviceId = ? order by createdAt desc limit 12;`;
    const [rows] = await this.promisePool.query(sql, deviceId);
    return rows;
  }

  // 디바이스별 실시간 데이터 조회
  async getLastestRealtimeData(deviceId) {
    const sql = `select * from realtime where deviceId = ? order by createdAt desc limit 1;`;
    const [rows] = await this.promisePool.query(sql, [deviceId]);
    console.log(rows);
    return rows;
  }
}

export default DB;
