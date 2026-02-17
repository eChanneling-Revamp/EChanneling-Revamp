import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prescriptionNumber = searchParams.get("prescriptionNumber");

    if (!prescriptionNumber) {
      return NextResponse.json(
        { message: "Prescription number is required" },
        { status: 400 },
      );
    }

    // Fetch prescription with related data
    const prescription = await prisma.prescription.findUnique({
      where: {
        prescriptionNumber: prescriptionNumber.trim(),
      },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            phonenumber: true,
            specialization: true,
            profileImage: true,
          },
        },
        appointment: {
          select: {
            id: true,
            appointmentNumber: true,
            patientName: true,
            patientEmail: true,
            patientPhone: true,
            patientNIC: true,
            patientDateOfBirth: true,
            patientGender: true,
            patientAge: true,
            emergencyContactName: true,
            emergencyContactPhone: true,
            medicalHistory: true,
            currentMedications: true,
            allergies: true,
            insuranceProvider: true,
            insurancePolicyNumber: true,
            isNewPatient: true,
            createdAt: true,
          },
        },
      },
    });

    if (!prescription) {
      return NextResponse.json(
        {
          message:
            "Prescription not found. Please check the prescription number.",
        },
        { status: 404 },
      );
    }

    // Format the response
    const response = {
      prescription: {
        id: prescription.id,
        prescriptionNumber: prescription.prescriptionNumber,
        htmlContent: prescription.htmlContent,
        doctor: {
          name: prescription.doctor.name,
          specialization: prescription.doctor.specialization,
          email: prescription.doctor.email,
          phonenumber: prescription.doctor.phonenumber,
          profileImage: prescription.doctor.profileImage,
        },
        patient: {
          name: prescription.appointment.patientName,
          email: prescription.appointment.patientEmail,
          phone: prescription.appointment.patientPhone,
          nic: prescription.appointment.patientNIC,
          dateOfBirth: prescription.appointment.patientDateOfBirth,
          gender: prescription.appointment.patientGender,
          age: prescription.appointment.patientAge,
          emergencyContactName: prescription.appointment.emergencyContactName,
          emergencyContactPhone: prescription.appointment.emergencyContactPhone,
          medicalHistory: prescription.appointment.medicalHistory,
          currentMedications: prescription.appointment.currentMedications,
          allergies: prescription.appointment.allergies,
          insuranceProvider: prescription.appointment.insuranceProvider,
          insurancePolicyNumber: prescription.appointment.insurancePolicyNumber,
          isNewPatient: prescription.appointment.isNewPatient,
        },
        appointmentNumber: prescription.appointment.appointmentNumber,
        appointmentDate: prescription.appointment.createdAt,
        createdAt: prescription.createdAt,
        updatedAt: prescription.updatedAt,
        status: prescription.status,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Prescription search error:", error);
    return NextResponse.json(
      { message: "An error occurred while searching for the prescription" },
      { status: 500 },
    );
  }
}
