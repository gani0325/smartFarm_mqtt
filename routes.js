import express from "express";

const router = express.Router();

const init = (db, mqttClient) => {
  // 1) 모든 디바이스 리스트 조회
  router.get("/devices", async (req, res) => {
    const result = await db.getDevices();
    console.log(result);
    res.send(await db.getDevices());
  });
  // 2) 한 개 디바이스 정보 조회
  router.get("/devices/:deviceId", async (req, res, next) => {
    const { deviceId } = req.params;
    console.log(deviceId);

    if (!deviceId || deviceId === "") {
      res.status(400).send({ error: "deviceId empty error" });
    }

    const devices = await db.getOneDevice(deviceId);
    res.send(await devices);
  });

  // 3) 한 개 디바이스 정보 생성
  router.post("/devices/register", async (req, res, next) => {
    const {
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
    } = req.body;

    const devices = await db.insertData(
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
      soil
    );

    res.send(await devices);
  });

  // 4) 한 개 디바이스 정보 수정
  router.put("/devices/:deviceId", async (req, res, next) => {
    const { deviceId } = req.params;
    const {
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
    } = req.body;
    console.log(deviceId);

    if (!deviceId || deviceId === "") {
      res.status(400).send({ error: "deviceId empty error" });
    }

    const devices = await db.putOneDevice(
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
    );

    res.send(await devices);
  });
  // 5) 한 개 디바이스 정보 삭제
  router.delete("/devices/:deviceId", async (req, res, next) => {
    const { deviceId } = req.params;
    console.log(deviceId);

    if (!deviceId || deviceId === "") {
      res.status(400).send({ error: "deviceId empty error" });
    }

    const devices = await db.deleteOneDevice(deviceId);
    res.send(await devices);
  });

  //realtime===========================
  // 실시간 데이터 조회 - 디바이스별 실시간 온습도 조회 => db에 있는 가장 최신값 보내주기
  // log값 보내주기
  router.get("/realtime/:deviceId", async (req, res) => {
    const { deviceId } = req.params;
    if (!deviceId || deviceId === "") {
      res.status(400).send({ error: "deviceId error" });
    }
    const lastestRealtimeData = await db.getLastestRealtimeData(deviceId);
    const sensorData = await db.getOneDevice(deviceId);
    const realtimeLog = await db.getRealtimes(deviceId);

    res.send({
      deviceData: sensorData,
      realtimeData: lastestRealtimeData, // 실시간 데이터
      realtimeLog: realtimeLog, // 데이터 히스토리 조회
    });
  });

  // 수동 조작
  router.post("/realtime/:deviceId", async (req, res) => {
    const { deviceId } = req.params;
    const { message } = req.body; // on/off
    if (!deviceId || deviceId === "") {
      res.status(400).send({ error: "deviceId error" });
    }
    // await mqttClient.sendCommand(`cmd/deviceId/motor`, message.toString());

    if (message == "on") {
      await mqttClient.sendCommand(`cmd/${deviceId}/motor`, "run");
    } else if (message == "off") {
      await mqttClient.sendCommand(`cmd/${deviceId}/motor`, "stop");
    }
  });
};
const getRouter = () => {
  return router;
};

export default {
  init,
  getRouter,
};
