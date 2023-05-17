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
const PORT = 3000;
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
  database: "smartFarm",
});

const mqttOptions = {
  // mqtt option 설정
  host: "52.79.210.192",
  port: 1883,
};

const mqttClient = new MqttClient(mqttOptions, ["dt/#"]); // 구독할 토픽 추가
mqttClient.connect();

mqttClient.setMessageCallback(async (topic, message) => {
  // 메시지 이벤트 콜백 설정
  const topicType = topic.split("/")[TOPIC_TYPE_INDEX];
  const messageJson = JSON.parse(message);

  try {
    // message event 콜백 로직 추가
    switch (topicType) {
      case "dt":
        db.insertData({
          device_id: messageJson.device_id,
          plantName: messageJson.plantName,
          plantNickName: messageJson.plantNickName,
          created_at: new Date(messageJson.timestamp),
          memo: messageJson.memo,
          potDiameter: messageJson.potDiameter,
          potHeight: messageJson.potHeight,
          plantDiameter: messageJson.plantDiameter,
          plantHeight: messageJson.plantHeight,
          region: messageJson.region,
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

api.init(db, mqttClient);
app.use(express.json());
app.use("/api", api.getRouter());

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
