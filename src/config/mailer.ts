import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  pool: true, // Use pooled connections
  maxConnections: 5, // Max simultaneous connections
  maxMessages: 100, // Max messages per connection
  rateDelta: 1000, // Rate limiting: time window in ms
  rateLimit: 5, // Rate limiting: max messages per rateDelta
});

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

// Send email function
export async function sendEmail(options: EmailOptions) {
  try {
    // Verify connection before sending
    await transporter.verify();
    console.log("SMTP connection verified");

    const mailOptions = {
      from: options.from || process.env.SMTP_FROM || process.env.SMTP_USER,
      to: Array.isArray(options.to) ? options.to.join(", ") : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

// Email templates
export const emailTemplates = {
  // Welcome email for new users
  welcome: (name: string) => ({
    subject: "Welcome to eChanneling!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to eChanneling!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for registering with eChanneling. We're excited to have you on board!</p>
        <p>You can now access our platform to book appointments with top doctors and hospitals.</p>
        <p>Best regards,<br>The eChanneling Team</p>
      </div>
    `,
    text: `Welcome to eChanneling! Dear ${name}, Thank you for registering with eChanneling. We're excited to have you on board!`,
  }),

  // Doctor approval notification
  doctorApproved: (doctorName: string) => ({
    subject: "Your Doctor Profile Has Been Approved",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Profile Approved!</h2>
        <p>Dear Dr. ${doctorName},</p>
        <p>Congratulations! Your doctor profile has been approved.</p>
        <p>You can now log in to the platform and start managing your sessions and appointments.</p>
        <p>Best regards,<br>The eChanneling Team</p>
      </div>
    `,
    text: `Profile Approved! Dear Dr. ${doctorName}, Congratulations! Your doctor profile has been approved.`,
  }),

  // Doctor rejection notification
  doctorRejected: (doctorName: string, reason?: string) => ({
    subject: "Update on Your Doctor Profile",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Profile Update</h2>
        <p>Dear Dr. ${doctorName},</p>
        <p>We regret to inform you that your doctor profile could not be approved at this time.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The eChanneling Team</p>
      </div>
    `,
    text: `Profile Update. Dear Dr. ${doctorName}, We regret to inform you that your doctor profile could not be approved at this time. ${
      reason ? `Reason: ${reason}` : ""
    }`,
  }),

  // Hospital approval notification
  hospitalApproved: (hospitalName: string) => ({
    subject: "Your Hospital Profile Has Been Approved",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Profile Approved!</h2>
        <p>Dear ${hospitalName} Team,</p>
        <p>Congratulations! Your hospital profile has been approved.</p>
        <p>You can now log in to the platform and start managing your staff and sessions.</p>
        <p>Best regards,<br>The eChanneling Team</p>
      </div>
    `,
    text: `Profile Approved! Dear ${hospitalName} Team, Congratulations! Your hospital profile has been approved.`,
  }),

  // Hospital rejection notification
  hospitalRejected: (hospitalName: string, reason?: string) => ({
    subject: "Update on Your Hospital Profile",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Profile Update</h2>
        <p>Dear ${hospitalName} Team,</p>
        <p>We regret to inform you that your hospital profile could not be approved at this time.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The eChanneling Team</p>
      </div>
    `,
    text: `Profile Update. Dear ${hospitalName} Team, We regret to inform you that your hospital profile could not be approved at this time. ${
      reason ? `Reason: ${reason}` : ""
    }`,
  }),

  // Appointment confirmation
  appointmentConfirmation: (
    patientName: string,
    doctorName: string,
    date: string,
    time: string
  ) => ({
    subject: "Appointment Confirmation - eChanneling",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Confirmed</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        <ul>
          <li><strong>Doctor:</strong> ${doctorName}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
        </ul>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>Best regards,<br>The eChanneling Team</p>
      </div>
    `,
    text: `Appointment Confirmed. Dear ${patientName}, Your appointment has been confirmed with Dr. ${doctorName} on ${date} at ${time}.`,
  }),
};

export default transporter;
