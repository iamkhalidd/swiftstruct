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
      } catch (err) {
        // Swallowing this used to fall through to the in-memory store, so the
        // account looked created but vanished on the next restart.
        throw new BadRequestException(`Could not create this user: ${this.describeDbError(err)}`);
      }
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

  async update(id: string, dto: UpdateUserDto, requesterId?: string) {
    let updateData: any = { ...dto };
    if (dto.password) {
      updateData.password = await bcrypt.hash(dto.password, 10);
    }

    // Guard against an admin locking themselves out of the portal.
    if (requesterId && requesterId === id && dto.role && dto.role !== Role.ADMIN) {
      throw new BadRequestException('You cannot change your own role.');
    }

    if (this.prisma.user) {
      try {
        return await this.prisma.user.update({
          where: { id },
          data: updateData,
          select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
        });
      } catch (err) {
        throw new BadRequestException(`Could not update this user: ${this.describeDbError(err)}`);
      }
    }

    const idx = this.memoryUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new NotFoundException('User not found');
    this.memoryUsers[idx] = { ...this.memoryUsers[idx], ...dto };
    return this.memoryUsers[idx];
  }

  async remove(id: string, requesterId?: string) {
    if (requesterId && requesterId === id) {
      throw new BadRequestException('You cannot remove your own account.');
    }

    if (this.prisma.user) {
      try {
        await this.prisma.user.delete({ where: { id } });
        return { message: 'User removed' };
      } catch (err) {
        // Previously this was swallowed, so a failed delete still returned
        // success and the row reappeared on reload.
        throw new BadRequestException(`Could not remove this user: ${this.describeDbError(err)}`);
      }
    }

    const idx = this.memoryUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new NotFoundException('User not found');
    this.memoryUsers.splice(idx, 1);
    return { message: 'User removed' };
  }

  private describeDbError(err: unknown): string {
    const code = (err as { code?: string } | null)?.code;
    if (code === 'P2025') return 'the user no longer exists';
    if (code === 'P2003') return 'the user is linked to existing records';
    if (code === 'P2002') return 'that email address is already in use';
    return err instanceof Error ? err.message : 'unknown database error';
  }
}
