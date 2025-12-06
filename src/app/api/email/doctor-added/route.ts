import { NextResponse } from "next/server";
import { sendEmail } from "@/config/mailer";

export async function POST(req: Request) {
  try {
    const { doctorEmail, doctorName, hospitalName } = await req.json();

    if (!doctorEmail || !doctorName || !hospitalName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const loginUrl = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/login`;

    // Send email to doctor
    const result = await sendEmail({
      to: doctorEmail,
      subject: `Congratulations! You've been added to ${hospitalName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0;">eChanneling</h1>
              <p style="color: #6b7280; margin: 5px 0;">Healthcare Management Platform</p>
            </div>
            
            <div style="background-color: #dcfce7; border-left: 4px solid #16a34a; padding: 20px; margin-bottom: 25px; border-radius: 4px;">
              <h2 style="color: #166534; margin: 0 0 10px 0; font-size: 20px;">🎉 Congratulations, Dr. ${doctorName}!</h2>
              <p style="color: #15803d; margin: 0; font-size: 16px;">You've been successfully added to ${hospitalName}'s medical team.</p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
              We're excited to inform you that <strong>${hospitalName}</strong> has added you to their system. 
              You can now log in to the eChanneling platform and start providing your valuable medical services.
            </p>
            
            <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">What's Next?</h3>
              <ol style="color: #4b5563; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Log in to your eChanneling account using your existing credentials</li>
                <li>View and manage your sessions at ${hospitalName}</li>
                <li>Access patient appointments and medical records</li>
                <li>Update your availability and schedule</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="display: inline-block; background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                Log In to Your Account
              </a>
            </div>
            
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>💡 Tip:</strong> Make sure to complete your profile and set your availability to start receiving appointments.
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                <strong>Need Help?</strong><br>
                If you have any questions or need assistance, please contact our support team or reach out to ${hospitalName} directly.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                This is an automated message from eChanneling.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 5px 0;">
                © ${new Date().getFullYear()} eChanneling. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (result.success) {
      return NextResponse.json(
        { message: "Email sent successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error sending doctor addition email:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
