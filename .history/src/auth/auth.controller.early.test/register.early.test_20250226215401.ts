
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthController } from '../auth.controller';


// Mock class for AuthService
class MockAuthService {
  findUserByEmail = jest.fn();
  register = jest.fn();
}

describe('AuthController.register() register method', () => {
  let authController: AuthController;
  let mockAuthService: MockAuthService;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockAuthService = new MockAuthService() as any;
    authController = new AuthController(mockAuthService as any);
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('Happy paths', () => {
    it('should register a new user and return a token', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';
      const token = 'some-jwt-token';

      jest.mocked(mockAuthService.findUserByEmail).mockResolvedValue(null as any as never);
      jest.mocked(mockAuthService.register).mockResolvedValue({ token } as any as never);

      // Act
      await authController.register({ email, password }, mockResponse as any);

      // Assert
      expect(mockAuthService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockAuthService.register).toHaveBeenCalledWith(email, password);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        token,
      });
    });
  });

  describe('Edge cases', () => {
    it('should return an error if the email already exists', async () => {
      // Arrange
      const email = 'existing@example.com';
      const password = 'password123';

      jest.mocked(mockAuthService.findUserByEmail).mockResolvedValue({} as any as never);

      // Act
      await authController.register({ email, password }, mockResponse as any);

      // Assert
      expect(mockAuthService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Account already exists',
      });
    });

    it('should return an error if registration fails', async () => {
      // Arrange
      const email = 'newuser@example.com';
      const password = 'password123';

      jest.mocked(mockAuthService.findUserByEmail).mockResolvedValue(null as any as never);
      jest.mocked(mockAuthService.register).mockResolvedValue({} as any as never);

      // Act
      await authController.register({ email, password }, mockResponse as any);

      // Assert
      expect(mockAuthService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockAuthService.register).toHaveBeenCalledWith(email, password);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User registration failed',
      });
    });

    it('should handle internal server errors gracefully', async () => {
      // Arrange
      const email = 'error@example.com';
      const password = 'password123';
      const errorMessage = 'Internal server error';

      jest.mocked(mockAuthService.findUserByEmail).mockRejectedValue(new Error(errorMessage) as never);

      // Act
      await authController.register({ email, password }, mockResponse as any);

      // Assert
      expect(mockAuthService.findUserByEmail).toHaveBeenCalledWith(email);
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: errorMessage,
      });
    });
  });
});