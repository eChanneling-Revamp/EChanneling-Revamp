import { NextResponse } from "next/server";
import { sendEmail } from "@/config/mailer";
import { generateMagicLinkToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { to, name, email, phonenumber, password, role, hospitalId, hospitalName } =
      await req.json();

    if (!to || !name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate magic link token for doctor/nurse setup
    const magicToken = generateMagicLinkToken({
      email,
      name,
      phoneNumber: phonenumber || "",
      role,
      hospitalId: hospitalId || "",
      hospitalName: hospitalName || "",
      type: role === "doctor" ? "doctor-setup" : "nurse-setup",
      createdByHospital: true, // Hospital is creating this doctor
    });

    const magicLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/auth/magic-login?token=${magicToken}`;

    // Determine the role display name
    const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

    // Send email with credentials
    const result = await sendEmail({
      to,
      subject: `Welcome to eChanneling - Your ${roleDisplay} Account`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">eChanneling</h1>
              <p style="color: #6b7280; margin: 5px 0;">Healthcare Management Platform</p>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome, ${name}!</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              Your ${roleDisplay} account has been created successfully. Below are your login credentials to access the eChanneling platform.
            </p>
            
            <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">Login Credentials</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 100px;">Email:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-family: monospace;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Password:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-family: monospace; background-color: #fef3c7; padding: 5px 10px; border-radius: 4px; display: inline-block;">${password}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Role:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${roleDisplay}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #991b1b; font-size: 14px;">
                <strong>⚠️ Important Security Notice:</strong><br>
                Please change your password immediately after your first login for security purposes.
              </p>
            </div>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${magicLink}" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Activate Account & Complete Setup
              </a>
            </div>
            
            <div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #0c4a6e; font-size: 14px;">
                <strong>📋 One-Click Setup:</strong><br>
                Click the button above to automatically log in and complete your profile setup. This secure link will expire in 7 days.
              </p>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
              <h3 style="color: #1f2937; font-size: 16px; margin-bottom: 10px;">Getting Started</h3>
              <ul style="color: #4b5563; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Log in using the credentials above</li>
                <li>Complete your profile information</li>
                <li>Change your password in account settings</li>
                ${
                  role === "doctor"
                    ? "<li>Set up your availability and session schedules</li>"
                    : ""
                }
                ${
                  role === "nurse"
                    ? "<li>Review your assigned sessions and duties</li>"
                    : ""
                }
              </ul>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">
                If you have any questions or need assistance, please contact our support team.
              </p>
              <p style="margin: 10px 0 0 0;">
                Best regards,<br>
                <strong>The eChanneling Team</strong>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 5px 0;">This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `,
      text: `
Welcome to eChanneling!

Hello ${name},

Your ${roleDisplay} account has been created successfully. Below are your login credentials:

Email: ${email}
Password: ${password}
Role: ${roleDisplay}

IMPORTANT: Please change your password immediately after your first login for security purposes.

One-Click Setup Link (expires in 7 days):
${magicLink}

Alternative Login URL: ${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/login

Getting Started:
1. Log in using the credentials above
2. Complete your profile information
3. Change your password in account settings
${role === "doctor" ? "4. Set up your availability and session schedules" : ""}
${role === "nurse" ? "4. Review your assigned sessions and duties" : ""}

If you have any questions or need assistance, please contact our support team.

Best regards,
The eChanneling Team
      `,
    });

    if (result.success) {
      return NextResponse.json(
        {
          message: "Credentials sent successfully",
          messageId: result.messageId,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error sending credentials email:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
