import dotenv from "dotenv";
import express from "express";
import MqttClient from "./mqtt/mqtt-client.js";
import DB from "./db/db.js";
import api from "./routes.js";

dotenv.config();
const app = express();
const PORT = 3000;
const TOPIC_TYPE_INDEX = 0;
const SUB_TOPIC_INDEX = 1;
let topicDeviceId;

console.log("DBConnection...");
const db = new DB({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
console.log("DBConnection... 'OK");

console.log("mqttConnection...");
const mqttOptions = {
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
  username: process.env.MQTT_BROKER_USERNAME,
  password: process.env.MQTT_BROKER_PASSWORD,
};

const mqttClient = new MqttClient(mqttOptions, ["data/#", "registration/#"]); // 구독할 토픽 추가
mqttClient.connect();

mqttClient.setMessageCallback(async (topic, message) => {
  // 메시지 이벤트 콜백 설정
  const topicType = topic.split("/")[TOPIC_TYPE_INDEX]; // data, registration
  const subTopic = topic.split("/")[SUB_TOPIC_INDEX]; // deviceId,

  try {
    if (topicType == "registration") {
      topicDeviceId = subTopic;
      console.log(subTopic);
      console.log(message.toString());
      const result = await db.insertDevice(subTopic);
      console.log(result);
    } else if (topicType == "data") {
      if (subTopic == "B4:8A:0A:75:A4:40") {
        const messageJson = JSON.parse(message);
        // const data1 = messageJson.sensor_data.replace(/,/g, "");
        console.log(messageJson.connection_device_id);
        const data = messageJson.sensor_data.split(",");
        const sensor_data = {};
        for (var i = 0; i < data.length; i++) {
          Object.assign(sensor_data, JSON.parse(data[i]));
        }
        console.log(sensor_data);
        console.log("==========messageJson==================");
        console.log(messageJson);
        console.log("=======================================");
        db.insertRealtimeData({
          deviceId: messageJson.connection_device_id,
          temperature: parseFloat(sensor_data.temper),
          humid: parseFloat(sensor_data.humid),
          soil: parseFloat(sensor_data.soil),
          createdAt: new Date(),
        });
      }
    } else {
      console.log("모르는 토픽");
    }
  } catch {
    console.log(error);
  }
});

api.init(db, mqttClient);
app.use(express.json());
app.use("/api", api.getRouter());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
