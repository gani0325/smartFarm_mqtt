import mqtt from "mqtt";

const options = {
  // mqtt option 설정
  host: "52.79.210.192",
  port: 1883,
};

const client = mqtt.connect(options);

client.on("connect", () => {
  client.subscribe("test_topic", (err) => {
    if (err) {
      console.log(err);
    }
  });
});

client.on("message", (topic, message) => {
  console.log(topic, message);
});
