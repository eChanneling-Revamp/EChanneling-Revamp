import nodemailer from 'nodemailer';

/**
 * Email configuration for sending notifications
 * Supports SMTP, Gmail, and other email providers
 */
export class MailerConfig {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send email notification
   * @param to - Recipient email address
   * @param subject - Email subject
   * @param html - HTML content
   * @param text - Plain text content (optional)
   */
  async sendEmail({
    to,
    subject,
    html,
    text,
  }: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject,
        html,
        text,
      });

      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send doctor verification email
   * @param doctorEmail - Doctor's email address
   * @param doctorName - Doctor's name
   * @param hospitalName - Hospital name
   */
  async sendDoctorVerificationEmail(
    doctorEmail: string,
    doctorName: string,
    hospitalName: string
  ): Promise<boolean> {
    const subject = 'Doctor Verification - EChanneling';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Doctor Verification Successful</h2>
        <p>Dear Dr. ${doctorName},</p>
        <p>Congratulations! Your doctor profile has been successfully verified and approved.</p>
        <p><strong>Hospital:</strong> ${hospitalName}</p>
        <p>You can now start accepting appointments through the EChanneling platform.</p>
        <p>If you have any questions, please contact our support team.</p>
        <br>
        <p>Best regards,<br>EChanneling Team</p>
      </div>
    `;

    return this.sendEmail({
      to: doctorEmail,
      subject,
      html,
    });
  }

  /**
   * Send invoice email
   * @param userEmail - User's email address
   * @param userName - User's name
   * @param invoiceNumber - Invoice number
   * @param amount - Invoice amount
   */
  async sendInvoiceEmail(
    userEmail: string,
    userName: string,
    invoiceNumber: string,
    amount: number
  ): Promise<boolean> {
    const subject = `Invoice ${invoiceNumber} - EChanneling`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Invoice Generated</h2>
        <p>Dear ${userName},</p>
        <p>Your invoice has been generated successfully.</p>
        <p><strong>Invoice Number:</strong> ${invoiceNumber}</p>
        <p><strong>Amount:</strong> LKR ${amount.toFixed(2)}</p>
        <p>Please make the payment before the due date to avoid any late fees.</p>
        <p>You can view and download your invoice from your dashboard.</p>
        <br>
        <p>Best regards,<br>EChanneling Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  /**
   * Send payment confirmation email
   * @param userEmail - User's email address
   * @param userName - User's name
   * @param amount - Payment amount
   * @param transactionId - Transaction ID
   */
  async sendPaymentConfirmationEmail(
    userEmail: string,
    userName: string,
    amount: number,
    transactionId: string
  ): Promise<boolean> {
    const subject = 'Payment Confirmation - EChanneling';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Payment Confirmed</h2>
        <p>Dear ${userName},</p>
        <p>Your payment has been successfully processed.</p>
        <p><strong>Amount:</strong> LKR ${amount.toFixed(2)}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p>Thank you for using EChanneling services.</p>
        <br>
        <p>Best regards,<br>EChanneling Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  /**
   * Send password reset email
   * @param userEmail - User's email address
   * @param userName - User's name
   * @param resetToken - Password reset token
   */
  async sendPasswordResetEmail(
    userEmail: string,
    userName: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    const subject = 'Password Reset - EChanneling';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Password Reset Request</h2>
        <p>Dear ${userName},</p>
        <p>You have requested to reset your password. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <br>
        <p>Best regards,<br>EChanneling Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }
}

// Export singleton instance
export const mailer = new MailerConfig();