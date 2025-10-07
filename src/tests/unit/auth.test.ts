import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { NextRequest } from 'next/server';
import { 
  isAuthenticated, 
  hasRole, 
  isAdmin, 
  getUserSession,
  requireAuth 
} from '@/lib/auth';

// Mock NextAuth
jest.mock('next-auth/jwt', () => ({
  getToken: jest.fn(),
}));

describe('Auth Utilities', () => {
  let mockRequest: NextRequest;

  beforeEach(() => {
    mockRequest = {
      headers: new Headers(),
    } as NextRequest;
  });

  describe('getUserSession', () => {
    it('should return null when no token is found', async () => {
      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(null);

      const result = await getUserSession(mockRequest);
      expect(result).toBeNull();
    });

    it('should return user session when token is valid', async () => {
      const mockToken = {
        userId: 'user123',
        email: 'test@example.com',
        role: 'USER',
        name: 'Test User',
      };

      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(mockToken);

      const result = await getUserSession(mockRequest);
      expect(result).toEqual(mockToken);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when user is not authenticated', async () => {
      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(null);

      const result = await isAuthenticated(mockRequest);
      expect(result).toBe(false);
    });

    it('should return true when user is authenticated', async () => {
      const mockToken = {
        userId: 'user123',
        email: 'test@example.com',
        role: 'USER',
        name: 'Test User',
      };

      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(mockToken);

      const result = await isAuthenticated(mockRequest);
      expect(result).toBe(true);
    });
  });

  describe('hasRole', () => {
    it('should return false when user has no session', async () => {
      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(null);

      const result = await hasRole(mockRequest, 'ADMIN');
      expect(result).toBe(false);
    });

    it('should return true when user has the required role', async () => {
      const mockToken = {
        userId: 'user123',
        email: 'admin@example.com',
        role: 'ADMIN',
        name: 'Admin User',
      };

      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(mockToken);

      const result = await hasRole(mockRequest, 'ADMIN');
      expect(result).toBe(true);
    });

    it('should return false when user does not have the required role', async () => {
      const mockToken = {
        userId: 'user123',
        email: 'user@example.com',
        role: 'USER',
        name: 'Regular User',
      };

      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(mockToken);

      const result = await hasRole(mockRequest, 'ADMIN');
      expect(result).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true when user is admin', async () => {
      const mockToken = {
        userId: 'user123',
        email: 'admin@example.com',
        role: 'ADMIN',
        name: 'Admin User',
      };

      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(mockToken);

      const result = await isAdmin(mockRequest);
      expect(result).toBe(true);
    });

    it('should return false when user is not admin', async () => {
      const mockToken = {
        userId: 'user123',
        email: 'user@example.com',
        role: 'USER',
        name: 'Regular User',
      };

      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(mockToken);

      const result = await isAdmin(mockRequest);
      expect(result).toBe(false);
    });
  });

  describe('requireAuth', () => {
    it('should throw error when user is not authenticated', async () => {
      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(null);

      await expect(requireAuth(mockRequest)).rejects.toThrow('Authentication required');
    });

    it('should not throw error when user is authenticated', async () => {
      const mockToken = {
        userId: 'user123',
        email: 'test@example.com',
        role: 'USER',
        name: 'Test User',
      };

      const { getToken } = require('next-auth/jwt');
      getToken.mockResolvedValue(mockToken);

      await expect(requireAuth(mockRequest)).resolves.not.toThrow();
    });
  });
});
