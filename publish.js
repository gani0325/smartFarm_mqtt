import mqtt from "mqtt";

const options = {
  // mqtt option 설정
  host: "52.79.210.192",
  port: 1883,
};
const client = mqtt.connect(options);

client.on("connect", () => {
  setInterval(() => {
    console.log("publishing .... ");
    client.publish("test_topic", "hello wolrd");
  }, 1000);
});
