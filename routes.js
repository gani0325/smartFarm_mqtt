import express from 'express';

const router = express.Router();

const init = (db, mqttClient) => {
  router.get('/data/realtime', async (req, res) => {
    // 실시간 데이터 조회
    
  })
}

const getRouter = () => {
  return router
}

export default {
  init, 
  getRouter,
}

