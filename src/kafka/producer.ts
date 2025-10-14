import { Kafka, Producer } from 'kafkajs';
import { KAFKA_TOPICS } from '@/config/constants';

/**
 * Kafka producer for sending events
 * Handles event-driven architecture for the healthcare platform
 */
export class KafkaProducer {
  private producer: Producer;
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'echanneling-producer',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
  }

  /**
   * Connect to Kafka
   */
  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      console.log('✅ Kafka producer connected');
    } catch (error) {
      console.error('❌ Kafka producer connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from Kafka
   */
  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log('✅ Kafka producer disconnected');
    } catch (error) {
      console.error('❌ Kafka producer disconnection failed:', error);
    }
  }

  /**
   * Check if producer is connected
   */
  private isConnected(): boolean {
    // Simple check - in production you might want more sophisticated checking
    return this.producer !== null;
  }

  /**
   * Send event to Kafka topic (safe - won't throw if disconnected)
   * @param topic - Kafka topic name
   * @param message - Event message
   * @param key - Optional message key for partitioning
   */
  async sendEvent(
    topic: string,
    message: any,
    key?: string
  ): Promise<void> {
    try {
      const result = await this.producer.send({
        topic,
        messages: [
          {
            key: key || null,
            value: JSON.stringify({
              ...message,
              timestamp: new Date().toISOString(),
              source: 'echanneling-backend',
            }),
          },
        ],
      });

      console.log(`✅ Event sent to topic ${topic}:`, result);
    } catch (error) {
      console.error(`❌ Failed to send event to topic ${topic}:`, error);
      // Don't throw - make it non-blocking for application flow
      // In production, you might want to queue these events for retry
    }
  }

  /**
   * Send event to Kafka topic safely (non-blocking)
   * @param topic - Kafka topic name
   * @param message - Event message
   * @param key - Optional message key for partitioning
   */
  async sendEventSafe(
    topic: string,
    message: any,
    key?: string
  ): Promise<boolean> {
    try {
      await this.sendEvent(topic, message, key);
      return true;
    } catch (error) {
      console.warn(`⚠️ Kafka event failed for topic ${topic}, continuing anyway:`, error);
      return false;
    }
  }

  /**
   * Send user created event
   * @param userData - User data
   */
  async sendUserCreatedEvent(userData: {
    userId: string;
    email: string;
    name: string;
    role: string;
  }): Promise<boolean> {
    return await this.sendEventSafe(KAFKA_TOPICS.USER_CREATED, {
      event: 'user.created',
      data: userData,
    }, userData.userId);
  }

  /**
   * Send user updated event
   * @param userData - Updated user data
   */
  async sendUserUpdatedEvent(userData: {
    userId: string;
    email: string;
    name: string;
    role: string;
    changes: Record<string, any>;
  }): Promise<boolean> {
    return await this.sendEventSafe(KAFKA_TOPICS.USER_UPDATED, {
      event: 'user.updated',
      data: userData,
    }, userData.userId);
  }

  /**
   * Send doctor verified event
   * @param doctorData - Doctor data
   */
  async sendDoctorVerifiedEvent(doctorData: {
    doctorId: string;
    name: string;
    email: string;
    hospitalId: string;
    hospitalName: string;
    specializationId: string;
    specializationName: string;
  }): Promise<boolean> {
    return await this.sendEventSafe(KAFKA_TOPICS.DOCTOR_VERIFIED, {
      event: 'doctor.verified',
      data: doctorData,
    }, doctorData.doctorId);
  }

  /**
   * Send invoice generated event
   * @param invoiceData - Invoice data
   */
  async sendInvoiceGeneratedEvent(invoiceData: {
    invoiceId: string;
    invoiceNumber: string;
    userId: string;
    userEmail: string;
    userName: string;
    amount: number;
    dueDate: string;
  }): Promise<boolean> {
    return await this.sendEventSafe(KAFKA_TOPICS.INVOICE_GENERATED, {
      event: 'invoice.generated',
      data: invoiceData,
    }, invoiceData.invoiceId);
  }

  /**
   * Send payment completed event
   * @param paymentData - Payment data
   */
  async sendPaymentCompletedEvent(paymentData: {
    paymentId: string;
    userId: string;
    userEmail: string;
    userName: string;
    amount: number;
    transactionId: string;
    invoiceId?: string;
  }): Promise<boolean> {
    return await this.sendEventSafe(KAFKA_TOPICS.PAYMENT_COMPLETED, {
      event: 'payment.completed',
      data: paymentData,
    }, paymentData.paymentId);
  }

  /**
   * Send email sent event
   * @param emailData - Email data
   */
  async sendEmailSentEvent(emailData: {
    to: string;
    subject: string;
    template: string;
    status: 'sent' | 'failed';
    messageId?: string;
  }): Promise<boolean> {
    return await this.sendEventSafe(KAFKA_TOPICS.EMAIL_SENT, {
      event: 'email.sent',
      data: emailData,
    }, emailData.to);
  }

  /**
   * Send audit log event
   * @param auditData - Audit log data
   */
  async sendAuditLogEvent(auditData: {
    action: string;
    entityType: string;
    entityId: string;
    userId: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<boolean> {
    return await this.sendEventSafe(KAFKA_TOPICS.AUDIT_LOG, {
      event: 'audit.log.created',
      data: auditData,
    }, auditData.entityId);
  }

  /**
   * Send custom event
   * @param topic - Custom topic
   * @param eventData - Event data
   * @param key - Optional key
   */
  async sendCustomEvent(
    topic: string,
    eventData: any,
    key?: string
  ): Promise<boolean> {
    return await this.sendEventSafe(topic, eventData, key);
  }
}

// Singleton instance
let kafkaProducer: KafkaProducer | null = null;

/**
 * Get Kafka producer instance
 */
export const getKafkaProducer = (): KafkaProducer => {
  if (!kafkaProducer) {
    kafkaProducer = new KafkaProducer();
  }
  return kafkaProducer;
};

/**
 * Initialize Kafka producer
 */
export const initializeKafkaProducer = async (): Promise<KafkaProducer> => {
  const producer = getKafkaProducer();
  await producer.connect();
  return producer;
};

/**
 * Gracefully shutdown Kafka producer
 */
export const shutdownKafkaProducer = async (): Promise<void> => {
  if (kafkaProducer) {
    await kafkaProducer.disconnect();
    kafkaProducer = null;
  }
};
