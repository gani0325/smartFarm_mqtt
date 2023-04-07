import dotenv from "dotenv";
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
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
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const mqttOptions = {
  host: process.env.MQTT_BROKER_HOST,
  port: process.env.MQTT_BROKER_PORT,
};

const mqttClient = new MqttClient(mqttOptions, ["dt/#"]);
mqttClient.connect();

mqttClient.setMessageCallback(async (topic, message) => {
  try {
    console.log(topic, message);
    const topicType = topic.split("/")[TOPIC_TYPE_INDEX];
    const messageJson = JSON.parse(message);
    switch (topicType) {
      case "dt":
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
app.use(express.static('front-project/public'));
app.use("/api", api.getRouter());
app.get('*', (req, res) => {
  // sendFile 추가
  res.sendFile('front-project/public/index.html', {root: __dirname});
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
