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
    time: string,
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

  // Doctor session notification
  sessionCreated: (
    doctorName: string,
    hospitalName: string,
    date: string,
    startTime: string,
    endTime: string,
    location: string,
    capacity: number,
  ) => ({
    subject: "New Session Scheduled - eChanneling",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 24px;">New Session Scheduled</h2>
        </div>
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">Dear Dr. ${doctorName},</p>
          <p style="font-size: 15px; color: #475569; margin-bottom: 25px;">
            A new session has been scheduled for you at <strong>${hospitalName}</strong>. Please review the details below:
          </p>
          
          <div style="background-color: white; border-left: 4px solid #2563eb; padding: 20px; margin: 25px 0; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #2563eb; margin-top: 0; font-size: 18px; margin-bottom: 15px;">Session Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 40%;">Hospital:</td>
                <td style="padding: 8px 0; color: #1e293b;">${hospitalName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Date:</td>
                <td style="padding: 8px 0; color: #1e293b;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Time:</td>
                <td style="padding: 8px 0; color: #1e293b;">${startTime} - ${endTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Location:</td>
                <td style="padding: 8px 0; color: #1e293b;">${location || "To be confirmed"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Capacity:</td>
                <td style="padding: 8px 0; color: #1e293b;">${capacity} patients</td>
              </tr>
            </table>
          </div>

          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>📋 Note:</strong> Please log in to your dashboard to view and manage this session. You can update your availability or make changes as needed.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/doctor/sessions" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
              View Session Details
            </a>
          </div>

          <p style="font-size: 14px; color: #64748b; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            If you have any questions or need to make changes to this session, please contact ${hospitalName} directly or reach out to our support team.
          </p>

          <p style="font-size: 14px; color: #475569; margin-top: 20px;">
            Best regards,<br>
            <strong style="color: #2563eb;">The eChanneling Team</strong>
          </p>
        </div>
      </div>
    `,
    text: `New Session Scheduled - Dear Dr. ${doctorName}, A new session has been scheduled for you at ${hospitalName}. Details: Date: ${date}, Time: ${startTime} - ${endTime}, Location: ${location || "To be confirmed"}, Capacity: ${capacity} patients. Please log in to your dashboard to view and manage this session.`,
  }),

  // Appointment completion notification
  appointmentCompleted: (
    patientName: string,
    doctorName: string,
    appointmentNumber: string,
    consultationFee: string,
    prescriptionNumber?: string,
  ) => ({
    subject: "Appointment Completed - eChanneling",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 24px;">✅ Appointment Completed</h2>
        </div>
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #1e293b; margin-bottom: 20px;">Dear ${patientName},</p>
          <p style="font-size: 15px; color: #475569; margin-bottom: 25px;">
            Your appointment with <strong>Dr. ${doctorName}</strong> has been successfully completed. Below are the details of your consultation:
          </p>
          
          <div style="background-color: white; border-left: 4px solid #16a34a; padding: 20px; margin: 25px 0; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="color: #16a34a; margin-top: 0; font-size: 18px; margin-bottom: 15px;">Appointment Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 45%;">Appointment Number:</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${appointmentNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Doctor:</td>
                <td style="padding: 8px 0; color: #1e293b;">Dr. ${doctorName}</td>
              </tr>
              ${
                prescriptionNumber
                  ? `<tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Prescription Number:</td>
                <td style="padding: 8px 0; color: #1e293b; font-weight: 600;">${prescriptionNumber}</td>
              </tr>`
                  : ""
              }
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Consultation Fee:</td>
                <td style="padding: 8px 0; color: #16a34a; font-weight: 700; font-size: 18px;">LKR ${consultationFee}</td>
              </tr>
            </table>
          </div>

          ${
            prescriptionNumber
              ? `
          <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>📋 Prescription Available:</strong> Your prescription has been issued and is available in your patient portal. Please follow the prescribed medications and instructions carefully.
            </p>
          </div>
          `
              : ""
          }

          <div style="background-color: #fff7ed; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>💳 Payment:</strong> Please proceed to the payment counter or pay online through your patient portal to complete your payment of LKR ${consultationFee}.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login" 
               style="display: inline-block; background-color: #16a34a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(22, 163, 74, 0.3);">
              View Appointment Details
            </a>
          </div>

          <p style="font-size: 14px; color: #64748b; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            Thank you for choosing eChanneling. We hope you had a great experience. If you have any questions or concerns, please don't hesitate to contact us.
          </p>

          <p style="font-size: 14px; color: #475569; margin-top: 20px;">
            Best regards,<br>
            <strong style="color: #16a34a;">The eChanneling Team</strong>
          </p>
        </div>
      </div>
    `,
    text: `Appointment Completed - Dear ${patientName}, Your appointment with Dr. ${doctorName} has been successfully completed. Appointment Number: ${appointmentNumber}, Consultation Fee: LKR ${consultationFee}${prescriptionNumber ? ", Prescription Number: " + prescriptionNumber : ""}. Please proceed with payment if not already completed.`,
  }),
};

export default transporter;
