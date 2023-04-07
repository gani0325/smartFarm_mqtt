import mysql from "mysql2";

class DB {
  constructor({ host, user, password, database }) {
    this.pool = mysql.createPool({
      host,
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

  async insertTemperature({ device_id, temperature, created_at }) {
    // 온도 insert 코드 작성
  }

  async insertHumidity({ device_id, humidity, created_at }) {
    // 습도 insert 코드 작성
  }
}

export default DB;
