"use client";

import { Clock, CheckCircle, Mail, Phone } from "lucide-react";

export default function PendingApprovalScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <Clock className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Pending Approval</h1>
            <p className="text-blue-100 text-lg">
              Your registration is under review
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-1">
                    Request Sent Successfully!
                  </h3>
                  <p className="text-green-700">
                    Your hospital registration has been submitted and is
                    currently being reviewed by our admin team.
                  </p>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Registration Submitted
                  </h4>
                  <p className="text-sm text-gray-600">
                    Your hospital information has been received
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-5 h-5 text-yellow-600 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Under Review</h4>
                  <p className="text-sm text-gray-600">
                    Admin is verifying your credentials and details
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-gray-400 font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-400">
                    Approval & Access
                  </h4>
                  <p className="text-sm text-gray-500">
                    You&apos;ll receive full access once approved
                  </p>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-blue-900 mb-3">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    Our admin team will review your hospital information within
                    24-48 hours
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    You will receive an email notification once your account is
                    approved
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>
                    After approval, you can access all features including staff
                    management, sessions, and appointments
                  </span>
                </li>
              </ul>
            </div>

            {/* Contact Support */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-500">Email Support</p>
                    <p className="font-medium text-gray-900">
                      support@echanneling.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-gray-500">Phone Support</p>
                    <p className="font-medium text-gray-900">+94 11 234 5678</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Please check your email regularly for updates on your approval status
        </p>
      </div>
    </div>
  );
}
