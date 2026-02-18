import React from "react";
import { Calendar, Users, Pill, Star, TrendingUp, Clock } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  bgColor,
  textColor,
}) => (
  <div
    className={`${bgColor} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
      </div>
      <div className="text-gray-300 opacity-50">{icon}</div>
    </div>
  </div>
);

interface AppointmentCardProps {
  patientName: string;
  patientPhone: string;
  time: string;
  status: string;
  consultationFee: string;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  patientName,
  patientPhone,
  time,
  status,
  consultationFee,
}) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-3">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{patientName}</p>
        <p className="text-sm text-gray-600">{patientPhone}</p>
        <p className="text-sm text-gray-500 mt-1 flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {time}
        </p>
      </div>
      <div className="text-right">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
            status === "CONFIRMED"
              ? "bg-green-100 text-green-800"
              : status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
          }`}
        >
          {status}
        </span>
        <p className="text-sm font-semibold text-blue-600 mt-2">
          Rs. {consultationFee}
        </p>
      </div>
    </div>
  </div>
);

interface SessionCardProps {
  hospital: string;
  location: string;
  date: string;
  time: string;
  capacity: number;
  bookedSlots: number;
  status: string;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  hospital,
  location,
  date,
  time,
  capacity,
  bookedSlots,
  status,
}) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-3">
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="font-semibold text-gray-900">{hospital}</p>
        <p className="text-sm text-gray-600">{location}</p>
      </div>
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          status === "SCHEDULED"
            ? "bg-blue-100 text-blue-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    </div>
    <div className="flex justify-between items-center text-sm">
      <div>
        <p className="text-gray-600">
          {date} at {time}
        </p>
      </div>
      <div className="text-right">
        <p className="text-gray-600">
          {bookedSlots}/{capacity} booked
        </p>
        <div className="w-24 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${(bookedSlots / capacity) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

interface PrescriptionCardProps {
  patientEmail: string;
  appointmentNumber: string;
  date: string;
  status: string;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  patientEmail,
  appointmentNumber,
  date,
  status,
}) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow mb-3">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <p className="font-semibold text-gray-900 flex items-center">
          <Pill className="w-4 h-4 mr-2 text-blue-600" />
          {appointmentNumber}
        </p>
        <p className="text-sm text-gray-600 mt-1">{patientEmail}</p>
        <p className="text-sm text-gray-500 mt-1">{date}</p>
      </div>
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          status === "ACTIVE"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    </div>
  </div>
);

export const SectionHeader: React.FC<{
  title: string;
  icon?: React.ReactNode;
}> = ({ title, icon }) => (
  <div className="flex items-center mb-4">
    {icon}
    <h2 className="text-xl font-bold text-gray-900">{title}</h2>
  </div>
);

export const EmptyState: React.FC<{
  message: string;
  icon?: React.ReactNode;
}> = ({ message, icon }) => (
  <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
    <div className="flex justify-center mb-3">{icon}</div>
    <p className="text-gray-600">{message}</p>
  </div>
);
