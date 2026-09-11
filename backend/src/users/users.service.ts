import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Role } from '../common/types/prisma-enums.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private memoryUsers: any[] = [
    {
      id: 'admin-fallback-uuid',
      email: 'admin@swiftstruct.com',
      firstName: 'SwiftStruct',
      lastName: 'Admin',
      role: Role.ADMIN,
      createdAt: new Date(),
    },
  ];

  constructor(private prisma: PrismaService) {}

  async findAll() {
    if (this.prisma.user) {
      try {
        return await this.prisma.user.findMany({
          select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
        });
      } catch {}
    }
    return this.memoryUsers;
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    if (this.prisma.user) {
      try {
        const user = await this.prisma.user.create({
          data: {
            email: dto.email,
            password: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: dto.role,
          },
          select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
        });
        return user;
      } catch {}
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      createdAt: new Date(),
    };
    this.memoryUsers.push(newUser);
    return newUser;
  }

  async update(id: string, dto: UpdateUserDto) {
    let updateData: any = { ...dto };
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    if (this.prisma.user) {
      try {
        const user = await this.prisma.user.update({
          where: { id },
          data: updateData,
          select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
        });
        return user;
      } catch {}
    }

    const idx = this.memoryUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new NotFoundException('User not found');
    this.memoryUsers[idx] = { ...this.memoryUsers[idx], ...dto };
    return this.memoryUsers[idx];
  }

  async remove(id: string) {
    if (this.prisma.user) {
      try {
        await this.prisma.user.delete({ where: { id } });
        return { message: 'User removed' };
      } catch {}
    }

    const idx = this.memoryUsers.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.memoryUsers.splice(idx, 1);
    }
    return { message: 'User removed' };
  }
}
