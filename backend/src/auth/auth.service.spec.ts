import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: () => 'mocked-jwt-token',
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: null,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should authenticate default admin user', async () => {
    const res = await service.login({
      email: 'admin@swiftstruct.com',
      password: 'Admin123!',
    });

    expect(res).toBeDefined();
    expect(res.accessToken).toBe('mocked-jwt-token');
    expect(res.user.email).toBe('admin@swiftstruct.com');
  });

  it('should throw UnauthorizedException on wrong password', async () => {
    await expect(
      service.login({
        email: 'admin@swiftstruct.com',
        password: 'WrongPassword!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
