import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "kafka-service",
  brokers: ["localhost:9094"],
});

const admin = kafka.admin();

const run = async () => {
  await admin.connect();
  await admin.createTopics({
    topics: [
      { topic: "user-created-successful" },
      { topic: "user-updated-successful" },
      { topic: "email-successful" },
    ],
  });
  console.log("✅ Topics created");
  await admin.disconnect();
};

try {
  await run();
} catch (err) {
  console.error("Kafka error:", err);
}
