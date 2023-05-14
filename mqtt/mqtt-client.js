import mqtt from "mqtt";

class MqttClient {
  #options;
  #client;
  #topics;

  constructor(options, topics) {
    this.#options = options;
    this.#topics = topics;
  }

  connect() {
    const self = this;

    self.#client = mqtt.connect(self.#options);
    self.#client.on("connect", () => {
      console.log("## connected");

      // 구독 코드
      self.#client.subscribe(self.#topics, (error) => {
        if (!error) {
          console.log("구독 성공");
        } else {
          console.log("구독 실패");
        }
      });
    });

    // 에러 이벤트 코드
    self.#client.on("error", (error) => {
      console.log(error);
    });
  }

  // MQTT 메시지 발행
  sendCommand(topic, message) {
    this.#client.publish(topic, JSON.stringify(message));
  }

  // 메시지 이벤트 콜백 설정 메소드
  setMessageCallback(cb) {
    this.#client.on("message", cb);
  }
}

export default MqttClient;
