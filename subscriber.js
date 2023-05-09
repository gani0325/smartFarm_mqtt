import mqtt from "mqtt";

const options = {
    host: "43.201.9.169",
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