import dotenv from "dotenv";
import express from "express";
import MqttClient from "./mqtt/mqtt-client.js";
import DB from "./db/db.js";

dotenv.config();
const app = express();
const PORT = 3000;
const SUB_TOPIC_INDEX = 2;
const db = new DB({
  // db 연결 정보 추가
});

const mqttOptions = {
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
};

const mqttClient = new MqttClient(mqttOptions, ["data/#"]);
mqttClient.connect();

mqttClient.setMessageCallback(async (topic, message) => {
  console.log(topic, message.toString());

  try {
    // message event 콜백 로직 추가
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
