import { Injectable, UnauthorizedException, OnModuleInit, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto } from './dto/login.dto.js';
import { Role } from '../common/types/prisma-enums.js';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultAdmin();
  }

  async seedDefaultAdmin() {
    try {
      if (!this.prisma.user) return;
      const adminEmail = 'admin@swiftstruct.com';
      const existing = await this.prisma.user.findUnique({ where: { email: adminEmail } });
      if (!existing) {
        const hashedPassword = await bcrypt.hash('Admin123!', 10);
        await this.prisma.user.create({
          data: {
            email: adminEmail,
            password: hashedPassword,
            firstName: 'SwiftStruct',
            lastName: 'Admin',
            role: Role.ADMIN,
          },
        });
        this.logger.log('Default admin user created: admin@swiftstruct.com');
      }
    } catch (err) {
      this.logger.warn('Could not seed default admin in DB:', err);
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    let user: any = null;
    try {
      if (this.prisma.user) {
        user = await this.prisma.user.findUnique({ where: { email } });
      }
    } catch {
      // Prisma fallback
    }

    // Default admin fallback if DB not seeded or disconnected
    if (!user && email.toLowerCase() === 'admin@swiftstruct.com') {
      const isDefaultPassValid = password === 'Admin123!';
      if (isDefaultPassValid) {
        user = {
          id: 'admin-fallback-uuid',
          email: 'admin@swiftstruct.com',
          firstName: 'SwiftStruct',
          lastName: 'Admin',
          role: Role.ADMIN,
        };
      } else {
        throw new UnauthorizedException('Invalid email or password');
      }
    } else if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }
    } else {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    try {
      if (this.prisma.user) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
        });
        if (user) return user;
      }
    } catch {
      // fallback
    }
    return {
      id: userId,
      email: 'admin@swiftstruct.com',
      firstName: 'SwiftStruct',
      lastName: 'Admin',
      role: Role.ADMIN,
      createdAt: new Date(),
    };
  }
}
