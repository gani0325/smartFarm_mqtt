import mqtt from "mqtt";
import dotenv from "dotenv";
dotenv.config();

const mqttOptions = {
  host: "3.39.194.9",
  port: 1883,
};

const client = mqtt.connect(mqttOptions);
// console.log(client);

client.on("connect", (connack) => {
  console.log("## test publisher connected");

  setInterval(() => {
    console.log("## published");
    client.publish(
      "dt/test-01",
      JSON.stringify({
        device_id: 1,
        plantName: "강낭콩",
        plantNickName: "귀요미",
        created_at: Date.now(),
        desc: "콩이용",
        potDiameter: 10,
        potHeight: 10,
        plantDiameter: 5,
        plantHeight: 5,
        region: "경기도",
        temperature: 5,
        humid: 6,
        soil: 8,
      })
    );
  }, 1000);
});
