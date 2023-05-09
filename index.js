import dotenv from 'dotenv';
import express from 'express';
import MqttClient from './mqtt/mqtt-client.js';

dotenv.config()
const app = express()
const PORT = 3000;

const mqttOptions = {
  // mqtt option 설정
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
};

const mqttClient = new MqttClient(mqttOptions, ['dt/test' ]); // 구독할 토픽 추가
mqttClient.connect();

mqttClient.setMessageCallback(async (topic, message)=>{
  // 메시지 이벤트 콜백 설정
  console.log(topic, message.toString());
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)  
})







