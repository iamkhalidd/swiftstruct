import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'swiftstruct-jwt-secret-key-2025',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    try {
      if (this.prisma.user) {
        const user = await this.prisma.user.findUnique({
          where: { id: payload.sub },
          select: { id: true, email: true, firstName: true, lastName: true, role: true },
        });
        if (user) return user;
      }
    } catch {
      // Fallback
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      firstName: 'SwiftStruct',
      lastName: 'Admin',
    };
  }
}
