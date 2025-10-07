import { describe, it, expect } from '@jest/globals';
import { 
  validateData, 
  createUserSchema, 
  createHospitalSchema,
  createDoctorSchema,
  sanitizeInput 
} from '@/utils/validators';

describe('Validators', () => {
  describe('validateData', () => {
    it('should validate correct user data', () => {
      const validUserData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        role: 'USER',
      };

      const result = validateData(createUserSchema, validUserData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validUserData);
    });

    it('should reject invalid email format', () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'Password123',
        role: 'USER',
      };

      const result = validateData(createUserSchema, invalidUserData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid email format');
    });

    it('should reject weak password', () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
        role: 'USER',
      };

      const result = validateData(createUserSchema, invalidUserData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Password must be at least 8 characters');
    });

    it('should reject invalid role', () => {
      const invalidUserData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        role: 'INVALID_ROLE',
      };

      const result = validateData(createUserSchema, invalidUserData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid enum value');
    });
  });

  describe('createHospitalSchema', () => {
    it('should validate correct hospital data', () => {
      const validHospitalData = {
        name: 'General Hospital',
        address: '123 Main Street, Colombo 01',
        city: 'Colombo',
        province: 'Western',
        phone: '+94112345678',
        email: 'info@generalhospital.com',
        registrationNumber: 'GH12345678',
        licenseNumber: 'GH123456',
      };

      const result = validateData(createHospitalSchema, validHospitalData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validHospitalData);
    });

    it('should reject invalid phone number', () => {
      const invalidHospitalData = {
        name: 'General Hospital',
        address: '123 Main Street, Colombo 01',
        city: 'Colombo',
        province: 'Western',
        phone: 'invalid-phone',
        email: 'info@generalhospital.com',
        registrationNumber: 'GH12345678',
        licenseNumber: 'GH123456',
      };

      const result = validateData(createHospitalSchema, invalidHospitalData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid phone number format');
    });

    it('should reject invalid registration number', () => {
      const invalidHospitalData = {
        name: 'General Hospital',
        address: '123 Main Street, Colombo 01',
        city: 'Colombo',
        province: 'Western',
        phone: '+94112345678',
        email: 'info@generalhospital.com',
        registrationNumber: 'invalid-reg',
        licenseNumber: 'GH123456',
      };

      const result = validateData(createHospitalSchema, invalidHospitalData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid registration number format');
    });
  });

  describe('createDoctorSchema', () => {
    it('should validate correct doctor data', () => {
      const validDoctorData = {
        name: 'Dr. Jane Smith',
        email: 'jane@example.com',
        phone: '+94112345678',
        licenseNumber: 'DR123456',
        specializationId: 'spec123',
        hospitalId: 'hosp123',
        experience: 5,
        qualifications: ['MBBS', 'MD'],
        consultationFee: 1500,
        availableDays: ['Monday', 'Tuesday'],
        availableHours: ['09:00', '10:00'],
      };

      const result = validateData(createDoctorSchema, validDoctorData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validDoctorData);
    });

    it('should reject consultation fee below minimum', () => {
      const invalidDoctorData = {
        name: 'Dr. Jane Smith',
        email: 'jane@example.com',
        phone: '+94112345678',
        licenseNumber: 'DR123456',
        specializationId: 'spec123',
        hospitalId: 'hosp123',
        experience: 5,
        qualifications: ['MBBS'],
        consultationFee: 100, // Below minimum
        availableDays: ['Monday'],
        availableHours: ['09:00'],
      };

      const result = validateData(createDoctorSchema, invalidDoctorData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Consultation fee must be at least LKR 500');
    });

    it('should reject empty qualifications array', () => {
      const invalidDoctorData = {
        name: 'Dr. Jane Smith',
        email: 'jane@example.com',
        phone: '+94112345678',
        licenseNumber: 'DR123456',
        specializationId: 'spec123',
        hospitalId: 'hosp123',
        experience: 5,
        qualifications: [], // Empty array
        consultationFee: 1500,
        availableDays: ['Monday'],
        availableHours: ['09:00'],
      };

      const result = validateData(createDoctorSchema, invalidDoctorData);
      expect(result.success).toBe(false);
      expect(result.error).toContain('At least one qualification is required');
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize string input', () => {
      const input = '  <script>alert("xss")</script>Hello World  ';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello World');
    });

    it('should sanitize object input', () => {
      const input = {
        name: '  John Doe  ',
        email: 'john@example.com',
        bio: '<p>Some HTML content</p>',
      };
      const result = sanitizeInput(input);
      expect(result).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        bio: 'Some HTML content',
      });
    });

    it('should sanitize array input', () => {
      const input = ['  Item 1  ', '  <script>alert("xss")</script>Item 2  '];
      const result = sanitizeInput(input);
      expect(result).toEqual(['Item 1', 'Item 2']);
    });

    it('should handle null and undefined', () => {
      expect(sanitizeInput(null)).toBeNull();
      expect(sanitizeInput(undefined)).toBeUndefined();
    });

    it('should handle numbers and booleans', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(true)).toBe(true);
    });
  });
});
