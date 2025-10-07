import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { KAFKA_TOPICS } from '@/config/constants';

/**
 * Kafka consumer for processing events
 * Handles incoming events from the event-driven architecture
 */
export class KafkaConsumer {
  private consumer: Consumer;
  private kafka: Kafka;
  private isRunning: boolean = false;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'echanneling-consumer',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.consumer = this.kafka.consumer({
      groupId: 'echanneling-consumer-group',
    });
  }

  /**
   * Connect to Kafka and subscribe to topics
   */
  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log('✅ Kafka consumer connected');

      // Subscribe to all topics
      const topics = Object.values(KAFKA_TOPICS);
      await this.consumer.subscribe({
        topics,
        fromBeginning: false,
      });

      console.log(`✅ Subscribed to topics: ${topics.join(', ')}`);
    } catch (error) {
      console.error('❌ Kafka consumer connection failed:', error);
      throw error;
    }
  }

  /**
   * Start consuming messages
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ Consumer is already running');
      return;
    }

    try {
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });

      this.isRunning = true;
      console.log('✅ Kafka consumer started');
    } catch (error) {
      console.error('❌ Kafka consumer start failed:', error);
      throw error;
    }
  }

  /**
   * Stop consuming messages
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('⚠️ Consumer is not running');
      return;
    }

    try {
      await this.consumer.stop();
      this.isRunning = false;
      console.log('✅ Kafka consumer stopped');
    } catch (error) {
      console.error('❌ Kafka consumer stop failed:', error);
    }
  }

  /**
   * Disconnect from Kafka
   */
  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      this.isRunning = false;
      console.log('✅ Kafka consumer disconnected');
    } catch (error) {
      console.error('❌ Kafka consumer disconnection failed:', error);
    }
  }

  /**
   * Handle incoming message
   * @param payload - Message payload
   */
  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    try {
      const { topic, partition, message } = payload;
      const messageValue = message.value?.toString();

      if (!messageValue) {
        console.warn('⚠️ Received empty message');
        return;
      }

      const eventData = JSON.parse(messageValue);
      console.log(`📨 Received event from topic ${topic}:`, {
        partition,
        offset: message.offset,
        key: message.key?.toString(),
        event: eventData.event,
      });

      // Route to appropriate handler based on topic
      await this.routeEvent(topic, eventData);

    } catch (error) {
      console.error('❌ Error handling message:', error);
      // In production, you might want to send failed messages to a dead letter queue
    }
  }

  /**
   * Route event to appropriate handler
   * @param topic - Kafka topic
   * @param eventData - Event data
   */
  private async routeEvent(topic: string, eventData: any): Promise<void> {
    try {
      switch (topic) {
        case KAFKA_TOPICS.USER_CREATED:
          await this.handleUserCreated(eventData);
          break;
        case KAFKA_TOPICS.USER_UPDATED:
          await this.handleUserUpdated(eventData);
          break;
        case KAFKA_TOPICS.DOCTOR_VERIFIED:
          await this.handleDoctorVerified(eventData);
          break;
        case KAFKA_TOPICS.INVOICE_GENERATED:
          await this.handleInvoiceGenerated(eventData);
          break;
        case KAFKA_TOPICS.PAYMENT_COMPLETED:
          await this.handlePaymentCompleted(eventData);
          break;
        case KAFKA_TOPICS.EMAIL_SENT:
          await this.handleEmailSent(eventData);
          break;
        case KAFKA_TOPICS.AUDIT_LOG:
          await this.handleAuditLog(eventData);
          break;
        default:
          console.log(`📝 Unhandled topic: ${topic}`);
      }
    } catch (error) {
      console.error(`❌ Error routing event for topic ${topic}:`, error);
    }
  }

  /**
   * Handle user created event
   * @param eventData - Event data
   */
  private async handleUserCreated(eventData: any): Promise<void> {
    console.log('👤 Processing user created event:', eventData.data);
    // Add your business logic here
    // For example: send welcome email, create user profile, etc.
  }

  /**
   * Handle user updated event
   * @param eventData - Event data
   */
  private async handleUserUpdated(eventData: any): Promise<void> {
    console.log('👤 Processing user updated event:', eventData.data);
    // Add your business logic here
    // For example: update user cache, send notification, etc.
  }

  /**
   * Handle doctor verified event
   * @param eventData - Event data
   */
  private async handleDoctorVerified(eventData: any): Promise<void> {
    console.log('👨‍⚕️ Processing doctor verified event:', eventData.data);
    // Add your business logic here
    // For example: send verification email, update doctor status, etc.
  }

  /**
   * Handle invoice generated event
   * @param eventData - Event data
   */
  private async handleInvoiceGenerated(eventData: any): Promise<void> {
    console.log('📄 Processing invoice generated event:', eventData.data);
    // Add your business logic here
    // For example: send invoice email, update payment status, etc.
  }

  /**
   * Handle payment completed event
   * @param eventData - Event data
   */
  private async handlePaymentCompleted(eventData: any): Promise<void> {
    console.log('💳 Processing payment completed event:', eventData.data);
    // Add your business logic here
    // For example: update invoice status, send confirmation email, etc.
  }

  /**
   * Handle email sent event
   * @param eventData - Event data
   */
  private async handleEmailSent(eventData: any): Promise<void> {
    console.log('📧 Processing email sent event:', eventData.data);
    // Add your business logic here
    // For example: update email status, log email delivery, etc.
  }

  /**
   * Handle audit log event
   * @param eventData - Event data
   */
  private async handleAuditLog(eventData: any): Promise<void> {
    console.log('📝 Processing audit log event:', eventData.data);
    // Add your business logic here
    // For example: store audit log, send alerts for sensitive actions, etc.
  }
}

// Singleton instance
let kafkaConsumer: KafkaConsumer | null = null;

/**
 * Get Kafka consumer instance
 */
export const getKafkaConsumer = (): KafkaConsumer => {
  if (!kafkaConsumer) {
    kafkaConsumer = new KafkaConsumer();
  }
  return kafkaConsumer;
};

/**
 * Initialize Kafka consumer
 */
export const initializeKafkaConsumer = async (): Promise<KafkaConsumer> => {
  const consumer = getKafkaConsumer();
  await consumer.connect();
  await consumer.start();
  return consumer;
};

/**
 * Gracefully shutdown Kafka consumer
 */
export const shutdownKafkaConsumer = async (): Promise<void> => {
  if (kafkaConsumer) {
    await consumer.stop();
    await consumer.disconnect();
    kafkaConsumer = null;
  }
};

/**
 * Start consumer service (for background processing)
 */
export const startConsumerService = async (): Promise<void> => {
  try {
    const consumer = await initializeKafkaConsumer();
    console.log('🚀 Kafka consumer service started');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('🛑 Shutting down Kafka consumer...');
      await consumer.stop();
      await consumer.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('🛑 Shutting down Kafka consumer...');
      await consumer.stop();
      await consumer.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start Kafka consumer service:', error);
    process.exit(1);
  }
};
