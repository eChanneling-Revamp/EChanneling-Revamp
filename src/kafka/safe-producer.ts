/**
 * Safe Kafka producer that gracefully handles connection failures
 * and allows the application to continue running even if Kafka is unavailable
 */
import { Kafka, Producer } from 'kafkajs';
import { KAFKA_TOPICS } from '@/config/constants';

export class SafeKafkaProducer {
  private producer: Producer | null = null;
  private kafka: Kafka | null = null;
  private isConnected: boolean = false;
  private isEnabled: boolean = false;

  constructor() {
    // Check if Kafka is enabled via environment variable
    this.isEnabled = process.env.KAFKA_ENABLED === 'true';
    
    if (this.isEnabled) {
      this.kafka = new Kafka({
        clientId: 'echanneling-producer',
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        retry: {
          initialRetryTime: 100,
          retries: 3, // Reduced retries for faster failure
        },
        connectionTimeout: 3000, // 3 second timeout
        requestTimeout: 25000,
      });

      this.producer = this.kafka.producer();
    }
  }

  /**
   * Connect to Kafka (optional - won't fail app if it fails)
   */
  async connect(): Promise<boolean> {
    if (!this.isEnabled || !this.producer) {
      console.log('⚠️ Kafka is disabled or not configured');
      return false;
    }

    try {
      await this.producer.connect();
      this.isConnected = true;
      console.log('✅ Kafka producer connected');
      return true;
    } catch (error) {
      console.warn('⚠️ Kafka producer connection failed (continuing without Kafka):', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Disconnect from Kafka
   */
  async disconnect(): Promise<void> {
    if (this.producer && this.isConnected) {
      try {
        await this.producer.disconnect();
        this.isConnected = false;
        console.log('✅ Kafka producer disconnected');
      } catch (error) {
        console.warn('⚠️ Kafka producer disconnection warning:', error);
      }
    }
  }

  /**
   * Send event to Kafka topic safely (non-blocking)
   */
  async sendEventSafe(
    topic: string,
    message: any,
    key?: string
  ): Promise<boolean> {
    if (!this.isEnabled || !this.producer || !this.isConnected) {
      // Silently skip if Kafka is not available
      return false;
    }

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

      console.log(`✅ Event sent to topic ${topic}`);
      return true;
    } catch (error) {
      console.warn(`⚠️ Failed to send event to topic ${topic} (continuing anyway):`, error);
      // Mark as disconnected and try to reconnect on next attempt
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Send audit log event
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
   * Send user created event
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
   * Get connection status
   */
  getStatus(): { enabled: boolean; connected: boolean } {
    return {
      enabled: this.isEnabled,
      connected: this.isConnected,
    };
  }
}

// Singleton instance
let safeKafkaProducer: SafeKafkaProducer | null = null;

/**
 * Get safe Kafka producer instance
 */
export const getSafeKafkaProducer = (): SafeKafkaProducer => {
  if (!safeKafkaProducer) {
    safeKafkaProducer = new SafeKafkaProducer();
  }
  return safeKafkaProducer;
};

/**
 * Initialize Kafka producer safely
 */
export const initializeSafeKafkaProducer = async (): Promise<SafeKafkaProducer> => {
  const producer = getSafeKafkaProducer();
  await producer.connect(); // Won't throw even if it fails
  return producer;
};
