import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/admin/hospitals/route';

// Mock Prisma Client
const mockPrisma = {
  hospital: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

// Mock auth utilities
jest.mock('@/lib/auth', () => ({
  requireAdmin: jest.fn(),
  getUserSession: jest.fn(),
}));

// Mock Kafka producer
jest.mock('@/kafka/producer', () => ({
  getKafkaProducer: jest.fn().mockReturnValue({
    sendAuditLogEvent: jest.fn(),
  }),
}));

describe('Hospitals API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful admin authentication
    const { requireAdmin, getUserSession } = require('@/lib/auth');
    requireAdmin.mockResolvedValue(undefined);
    getUserSession.mockResolvedValue({
      userId: 'admin123',
      email: 'admin@example.com',
      role: 'ADMIN',
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/admin/hospitals', () => {
    it('should return hospitals with pagination', async () => {
      const mockHospitals = [
        {
          id: 'hosp1',
          name: 'General Hospital',
          email: 'info@generalhospital.com',
          status: 'ACTIVE',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          userId: 'user1',
          user: { name: 'Admin User', email: 'admin@example.com' },
          _count: { doctors: 5, branches: 2 },
        },
      ];

      mockPrisma.hospital.count.mockResolvedValue(1);
      mockPrisma.hospital.findMany.mockResolvedValue(mockHospitals);

      const request = new NextRequest('http://localhost:3000/api/admin/hospitals?page=1&limit=10');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should filter hospitals by status', async () => {
      mockPrisma.hospital.count.mockResolvedValue(0);
      mockPrisma.hospital.findMany.mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/admin/hospitals?status=ACTIVE');
      const response = await GET(request);

      expect(mockPrisma.hospital.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'ACTIVE',
          }),
        })
      );
    });

    it('should search hospitals by name', async () => {
      mockPrisma.hospital.count.mockResolvedValue(0);
      mockPrisma.hospital.findMany.mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/admin/hospitals?search=General');
      const response = await GET(request);

      expect(mockPrisma.hospital.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              expect.objectContaining({
                name: expect.objectContaining({
                  contains: 'General',
                  mode: 'insensitive',
                }),
              }),
            ]),
          }),
        })
      );
    });

    it('should return 401 for unauthorized access', async () => {
      const { requireAdmin } = require('@/lib/auth');
      requireAdmin.mockRejectedValue(new Error('Role ADMIN required'));

      const request = new NextRequest('http://localhost:3000/api/admin/hospitals');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Unauthorized access');
    });
  });

  describe('POST /api/admin/hospitals', () => {
    it('should create a new hospital', async () => {
      const hospitalData = {
        name: 'New Hospital',
        address: '456 New Street, Colombo 02',
        city: 'Colombo',
        province: 'Western',
        phone: '+94112345678',
        email: 'info@newhospital.com',
        registrationNumber: 'NH12345678',
        licenseNumber: 'NH123456',
      };

      const createdHospital = {
        id: 'hosp2',
        ...hospitalData,
        status: 'PENDING_APPROVAL',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        userId: 'user2',
        user: { name: 'Admin User', email: 'admin@example.com' },
      };

      mockPrisma.hospital.findUnique.mockResolvedValue(null); // No existing hospital
      mockPrisma.hospital.create.mockResolvedValue(createdHospital);

      const request = new NextRequest('http://localhost:3000/api/admin/hospitals', {
        method: 'POST',
        body: JSON.stringify(hospitalData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('New Hospital');
      expect(mockPrisma.hospital.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            ...hospitalData,
            status: 'PENDING_APPROVAL',
          }),
        })
      );
    });

    it('should reject duplicate email', async () => {
      const hospitalData = {
        name: 'Duplicate Hospital',
        address: '789 Duplicate Street',
        city: 'Colombo',
        province: 'Western',
        phone: '+94112345678',
        email: 'duplicate@example.com',
        registrationNumber: 'DH12345678',
        licenseNumber: 'DH123456',
      };

      const existingHospital = {
        id: 'existing',
        email: 'duplicate@example.com',
      };

      mockPrisma.hospital.findUnique.mockResolvedValue(existingHospital);

      const request = new NextRequest('http://localhost:3000/api/admin/hospitals', {
        method: 'POST',
        body: JSON.stringify(hospitalData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Hospital with this email already exists');
    });

    it('should validate required fields', async () => {
      const invalidHospitalData = {
        name: 'Incomplete Hospital',
        // Missing required fields
      };

      const request = new NextRequest('http://localhost:3000/api/admin/hospitals', {
        method: 'POST',
        body: JSON.stringify(invalidHospitalData),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });
  });
});
