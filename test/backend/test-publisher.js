import mqtt from "mqtt";
import dotenv from "dotenv";
dotenv.config();

const mqttOptions = {
  // mqtt option 설정
  host: "52.79.210.192",
  port: 1883,
};

const client = mqtt.connect(mqttOptions);

client.on("connect", (connack) => {
  console.log("## test publisher connected");

  setInterval(() => {
    console.log("## published");
    const device_id = Math.round(Math.random() * 5);
    client.publish(
      "dt/test-01",
      JSON.stringify({
        device_id: 3,
        humidity: Math.round(Math.random() * 100),
        temperature: Math.round(Math.random() * 100),
        timestamp: Date.now(),
      })
    );
  }, 1000);
});

client.on("message", (topic, message) => {
  console.log(topic, JSON.parse(message.toString("utf-8")));
});
