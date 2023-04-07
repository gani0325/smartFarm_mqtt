import express from 'express';

const router = express.Router();

const init = (db, mqttClient) => {
  router.get('/data/realtime', async (req, res) => {
    // 실시간 데이터 조회
    res.send(await db.getLatestData());
  })

  router.get('/devices', async (req, res) => {
    res.send(await db.getDevices());
  })

  router.get('/data/devices/:device_id', async (req, res) => {
    const { device_id } = req.params;
    const { start, end } = req.query;

    if(!device_id || device_id === ''){
      res.status(400).send({ error: 'device_id error'})
    }
    console.log(await db.getData(device_id, start, end))
    res.send(await db.getData(device_id, start, end));
  })

  router.post('/cmd/devices/:device_id', async(req, res)=>{
    const { device_id } = req.params;
    const { command } = req.body;

    if(!device_id || device_id === ''){
      res.status(400).send({ error: 'device_id error'})
    }
    if(!command || command !== 'run' || command !== 'stop'){
      res.status(400).send({ error: 'command error'})
    }

    const device = await db.getOneDevice(device_id);

    await mqttClient.sendCommand(`cmd/${device.serial_num}/pump`, {
      serial_num: device.serial_num,
      command,
    })

  })
}

const getRouter = () => {
  return router
}

export default {
  init, 
  getRouter,
}

