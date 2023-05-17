import express from "express";

const router = express.Router();

const init = (db, mqttClient) => {
  // 1) 모든 디바이스 리스트 조회
  router.get("/devices", async (req, res) => {
    res.send(await db.getDevices());
  });

  // 2) 한 개 디바이스 정보 조회
  router.get("/devices/:device_id", async (req, res) => {
    const { device_id } = req.params;
    console.log(device_id);

    if (!device_id || device_id === "") {
      res.status(400).send({ error: "device_id empty error" });
    }

    const devices = await db.getOneDevice(device_id);
    res.send(await devices);
  });

  // 3) 한 개 디바이스 정보 생성
  router.post("/devices/register", async (req, res) => {
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
    const deivce_id = await db.getDeviceId();

    res.send(await devices, deivce_id);
  });

  // 4) 한 개 디바이스 정보 수정
  router.put("/devices/:device_id", async (req, res) => {
    const { device_id } = req.params;
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
    console.log(device_id);

    if (!device_id || device_id === "") {
      res.status(400).send({ error: "device_id empty error" });
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
      device_id
    );

    res.send(await devices);
  });
  // 5) 한 개 디바이스 정보 삭제
  router.delete("/devices/:device_id", async (req, res) => {
    const { device_id } = req.params;
    console.log(device_id);

    if (!device_id || device_id === "") {
      res.status(400).send({ error: "device_id empty error" });
    }

    const devices = await db.deleteOneDevice(device_id);
    res.send(await devices);
  });
};

export default {
  init,
};
