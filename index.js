import dotenv from "dotenv";
import express from "express";
import MqttClient from "./mqtt/mqtt-client.js";
import DB from "./db/db.js";

dotenv.config();
const app = express();
const PORT = 3000;
const TOPIC_TYPE_INDEX = 0;
const db = new DB({
  // db 연결 정보 추가
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const mqttOptions = {
  // mqtt option 설정
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
};

const mqttClient = new MqttClient(mqttOptions, ["dt/#"]); // 구독할 토픽 추가
mqttClient.connect();

mqttClient.setMessageCallback(async (topic, message) => {
  // 메시지 이벤트 콜백 설정
  console.log(topic, message.toString());
  const topicType = topic.split("/")[TOPIC_TYPE_INDEX];
  const messageJson = JSON.parse(message);

  try {
    // message event 콜백 로직 추가
    switch (topicType) {
      case "dt":
        db.insertData({
          device_id: messageJson.device_id,
          temperature: messageJson.temperature,
          humid: messageJson.humid,
          soil: messageJson.soil,
        });
        break;
      default:
        console.log("모르는 토픽");
        break;
    }
  } catch {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
