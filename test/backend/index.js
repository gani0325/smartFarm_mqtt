import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import MqttClient from "./mqtt/mqtt-client.js";
import DB from "./db/db.js";
import api from "./routes.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8080;
const TOPIC_TYPE_INDEX = 0;
dotenv.config();

const app = express();
app.use(cors());

const db = new DB({
  // db 연결 정보 추가
  host: "52.79.210.192",
  user: "root",
  post: 3306,
  password: "Admin1234~",
  database: "test",
});

const mqttOptions = {
  // mqtt option 설정
  host: "52.79.210.192",
  port: 1883,
};

const mqttClient = new MqttClient(mqttOptions, ["dt/#"]);
mqttClient.connect();

mqttClient.setMessageCallback(async (topic, message) => {
  try {
    const topicType = topic.split("/")[TOPIC_TYPE_INDEX];
    const messageJson = JSON.parse(message);
    switch (topicType) {
      case "dt":
        // 데이터 저장
        await db.insertData({
          device_id: messageJson.device_id,
          temperature: messageJson.temperature,
          humidity: messageJson.humidity,
          created_at: new Date(messageJson.timestamp),
        });
        break;
      default:
        console.log("undefined topic type");
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

api.init(db, mqttClient);
app.use(express.json());
app.use("/api", api.getRouter());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
