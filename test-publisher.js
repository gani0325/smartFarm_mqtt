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
    client.publish(
      "dt/test-05",
      JSON.stringify({
        device_id: "a5",
        plantName: "토마토",
        plantNickName: "통통이",
        timestamp: Date.now(),
        memo: "내가좋아해용",
        potDiameter: 16,
        potHeight: 16,
        plantDiameter: 11,
        plantHeight: 11,
        region: "가게",
        temperature: 13,
        humid: 16,
        soil: 18,
      })
    );
  }, 1000);
});

client.on("message", (topic, message) => {
  console.log(topic, JSON.parse(message.toString("utf-8")));
});
