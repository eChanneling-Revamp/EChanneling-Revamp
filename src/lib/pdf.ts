import jsPDF from 'jspdf';
import { Invoice, User, Doctor, Hospital } from '@prisma/client';

/**
 * PDF generation utilities for invoices and reports
 */

export interface InvoiceData {
  invoice: Invoice;
  user: User;
  doctor?: Doctor;
  hospital?: Hospital;
}

export interface PDFOptions {
  title?: string;
  fontSize?: number;
  margin?: number;
  orientation?: 'portrait' | 'landscape';
}

/**
 * Generate PDF invoice
 * @param invoiceData - Invoice data including user, doctor, and hospital info
 * @param options - PDF generation options
 * @returns PDF buffer
 */
export function generateInvoicePDF(
  invoiceData: InvoiceData,
  options: PDFOptions = {}
): Buffer {
  const {
    title = 'Invoice',
    fontSize = 12,
    margin = 20,
    orientation = 'portrait'
  } = options;

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Set font
  pdf.setFont('helvetica');

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EChanneling', margin, margin + 10);
  
  pdf.setFontSize(16);
  pdf.text(title, pageWidth - margin - 50, margin + 10);

  // Company info
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Healthcare Channeling Platform', margin, margin + 20);
  pdf.text('Colombo, Sri Lanka', margin, margin + 25);
  pdf.text('Email: info@echanneling.com', margin, margin + 30);
  pdf.text('Phone: +94 11 123 4567', margin, margin + 35);

  // Invoice details
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Invoice Details', margin, margin + 50);

  // Invoice number and date
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice Number: ${invoiceData.invoice.invoiceNumber}`, margin, margin + 60);
  pdf.text(`Date: ${formatDate(invoiceData.invoice.createdAt)}`, margin, margin + 65);
  pdf.text(`Due Date: ${formatDate(invoiceData.invoice.dueDate)}`, margin, margin + 70);

  // Customer details
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill To:', margin, margin + 85);

  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  pdf.text(invoiceData.user.name || 'N/A', margin, margin + 95);
  pdf.text(invoiceData.user.email, margin, margin + 100);
  pdf.text(`User ID: ${invoiceData.user.id}`, margin, margin + 105);

  // Service details
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Service Details', margin, margin + 120);

  // Service table header
  const tableY = margin + 130;
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', margin, tableY);
  pdf.text('Amount (LKR)', pageWidth - margin - 40, tableY);

  // Service line
  pdf.setFont('helvetica', 'normal');
  const serviceDescription = invoiceData.invoice.description || 'Healthcare Service';
  pdf.text(serviceDescription, margin, tableY + 10);
  pdf.text(invoiceData.invoice.amount.toFixed(2), pageWidth - margin - 40, tableY + 10);

  // Tax line
  if (invoiceData.invoice.tax > 0) {
    pdf.text('Tax', margin, tableY + 20);
    pdf.text(invoiceData.invoice.tax.toFixed(2), pageWidth - margin - 40, tableY + 20);
  }

  // Total line
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total', margin, tableY + 35);
  pdf.text(invoiceData.invoice.totalAmount.toFixed(2), pageWidth - margin - 40, tableY + 35);

  // Status
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Status: ${invoiceData.invoice.status}`, margin, tableY + 50);

  // Footer
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Thank you for using EChanneling services!', margin, pageHeight - margin - 20);
  pdf.text('For support, contact us at support@echanneling.com', margin, pageHeight - margin - 15);

  // Convert to buffer
  const pdfOutput = pdf.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

/**
 * Generate PDF report
 * @param title - Report title
 * @param data - Report data
 * @param options - PDF generation options
 * @returns PDF buffer
 */
export function generateReportPDF(
  title: string,
  data: any[],
  options: PDFOptions = {}
): Buffer {
  const {
    fontSize = 10,
    margin = 20,
    orientation = 'landscape'
  } = options;

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Set font
  pdf.setFont('helvetica');

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EChanneling Report', margin, margin + 10);
  
  pdf.setFontSize(16);
  pdf.text(title, margin, margin + 20);

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: ${formatDate(new Date())}`, margin, margin + 30);

  // Table headers
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const colWidth = (pageWidth - 2 * margin) / headers.length;
    
    let y = margin + 50;
    
    // Header row
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'bold');
    headers.forEach((header, index) => {
      const x = margin + (index * colWidth);
      pdf.text(header, x, y);
    });

    // Data rows
    pdf.setFont('helvetica', 'normal');
    data.forEach((row, rowIndex) => {
      y = margin + 60 + (rowIndex * 8);
      
      // Check if we need a new page
      if (y > pageHeight - margin - 20) {
        pdf.addPage();
        y = margin + 20;
      }

      headers.forEach((header, colIndex) => {
        const x = margin + (colIndex * colWidth);
        const value = String(row[header] || '');
        pdf.text(value, x, y);
      });
    });
  }

  // Footer
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Generated by EChanneling System', margin, pageHeight - margin - 10);

  // Convert to buffer
  const pdfOutput = pdf.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

/**
 * Generate payment receipt PDF
 * @param paymentData - Payment data
 * @param options - PDF generation options
 * @returns PDF buffer
 */
export function generatePaymentReceiptPDF(
  paymentData: any,
  options: PDFOptions = {}
): Buffer {
  const {
    title = 'Payment Receipt',
    fontSize = 12,
    margin = 20,
    orientation = 'portrait'
  } = options;

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Set font
  pdf.setFont('helvetica');

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EChanneling', margin, margin + 10);
  
  pdf.setFontSize(16);
  pdf.text(title, pageWidth - margin - 50, margin + 10);

  // Receipt details
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Receipt Details', margin, margin + 30);

  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Transaction ID: ${paymentData.transactionId}`, margin, margin + 40);
  pdf.text(`Date: ${formatDate(paymentData.createdAt)}`, margin, margin + 45);
  pdf.text(`Amount: LKR ${paymentData.amount.toFixed(2)}`, margin, margin + 50);
  pdf.text(`Payment Method: ${paymentData.paymentMethod}`, margin, margin + 55);
  pdf.text(`Status: ${paymentData.status}`, margin, margin + 60);

  // Footer
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Thank you for your payment!', margin, pageHeight - margin - 20);

  // Convert to buffer
  const pdfOutput = pdf.output('arraybuffer');
  return Buffer.from(pdfOutput);
}

/**
 * Format date for PDF
 * @param date - Date to format
 * @returns Formatted date string
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Generate QR code for payment
 * @param data - Data to encode in QR code
 * @returns QR code image buffer
 */
export function generateQRCode(data: string): Buffer {
  // This is a placeholder implementation
  // In production, you would use a QR code library like 'qrcode'
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.fillText('QR Code', 10, 20);
    ctx.fillText(data, 10, 40);
  }

  // Convert canvas to buffer
  const dataURL = canvas.toDataURL();
  const base64Data = dataURL.split(',')[1];
  return Buffer.from(base64Data, 'base64');
}

/**
 * Add watermark to PDF
 * @param pdf - jsPDF instance
 * @param text - Watermark text
 */
export function addWatermark(pdf: jsPDF, text: string = 'EChanneling'): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  pdf.setGState(new pdf.GState({ opacity: 0.1 }));
  pdf.setFontSize(50);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(200, 200, 200);
  pdf.text(text, pageWidth / 2, pageHeight / 2, {
    angle: 45,
    align: 'center'
  });
  pdf.setGState(new pdf.GState({ opacity: 1 }));
}
