# Email Configuration Guide

This guide explains how to set up email functionality using Nodemailer in the eChanneling application.

## 📧 Overview

The application uses Nodemailer to send transactional emails for:

- Welcome emails for new users
- Doctor/Hospital approval/rejection notifications
- Appointment confirmations
- Password reset emails
- Session notifications

## 🔧 Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure the following variables:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="eChanneling <noreply@echanneling.com>"
```

### 2. Gmail Setup (Recommended for Development)

If using Gmail:

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated 16-character password
   - Use this as your `SMTP_PASS`

**Important**: Never use your actual Gmail password!

### 3. Other Email Providers

#### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

#### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
```

#### AWS SES

```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

## 💻 Usage

### Import the mailer utilities

```typescript
import { sendEmail, emailTemplates } from "@/config/mailer";
```

### Send a basic email

```typescript
await sendEmail({
  to: "user@example.com",
  subject: "Test Email",
  text: "This is a plain text email",
  html: "<h1>This is an HTML email</h1>",
});
```

### Use pre-built templates

```typescript
// Welcome email
const welcomeEmail = emailTemplates.welcome("John Doe");
await sendEmail({
  to: "user@example.com",
  ...welcomeEmail,
});

// Doctor approval
const approvalEmail = emailTemplates.doctorApproved("Dr. Smith");
await sendEmail({
  to: "doctor@example.com",
  ...approvalEmail,
});

// Appointment confirmation
const confirmationEmail = emailTemplates.appointmentConfirmation(
  "Jane Doe",
  "Dr. Smith",
  "2024-01-15",
  "10:00 AM"
);
await sendEmail({
  to: "patient@example.com",
  ...confirmationEmail,
});
```

### Send to multiple recipients

```typescript
await sendEmail({
  to: ["user1@example.com", "user2@example.com"],
  subject: "Notification",
  html: "<p>This goes to multiple users</p>",
});
```

## 📝 Available Email Templates

1. `emailTemplates.welcome(name)` - Welcome email for new users
2. `emailTemplates.doctorApproved(doctorName)` - Doctor approval notification
3. `emailTemplates.doctorRejected(doctorName, reason?)` - Doctor rejection notification
4. `emailTemplates.hospitalApproved(hospitalName)` - Hospital approval notification
5. `emailTemplates.hospitalRejected(hospitalName, reason?)` - Hospital rejection notification
6. `emailTemplates.appointmentConfirmation(patientName, doctorName, date, time)` - Appointment confirmation

## 🔍 Testing

Test your email configuration:

```typescript
// In any API route or server component
import { sendEmail } from "@/config/mailer";

await sendEmail({
  to: "your-test-email@example.com",
  subject: "Test Email",
  html: "<p>If you receive this, your email configuration is working!</p>",
});
```

## 🚨 Troubleshooting

### Gmail "Less secure app access" error

- Make sure you're using an **App Password**, not your regular Gmail password
- Enable 2-Factor Authentication first

### Connection timeout

- Check your firewall settings
- Verify `SMTP_HOST` and `SMTP_PORT` are correct
- Try `SMTP_PORT=465` with `SMTP_SECURE=true` for SSL

### "Invalid login" error

- Double-check your `SMTP_USER` and `SMTP_PASS`
- Ensure there are no extra spaces in your `.env.local` file

### Emails going to spam

- Set up SPF, DKIM, and DMARC records for your domain
- Use a verified sender email address
- Consider using a dedicated email service (SendGrid, Mailgun, etc.)

## 🔒 Security Best Practices

1. **Never commit** `.env.local` to version control
2. Use **App Passwords** instead of real passwords
3. Rotate credentials regularly
4. Use environment-specific configurations
5. Consider using a dedicated email service for production

## 📚 Additional Resources

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [SendGrid SMTP Setup](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)
