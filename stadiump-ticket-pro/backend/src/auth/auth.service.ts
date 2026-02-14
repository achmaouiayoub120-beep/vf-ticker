import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(nom: string, prenom: string | null, email: string, password: string) {
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already registered');
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const user = this.userRepo.create({ nom, prenom: prenom || null, email, password: hash, role: 'user' });
    await this.userRepo.save(user);
    return { id: user.id };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.password, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    });
    return {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
      user: { id: user.id, email: user.email, nom: user.nom, prenom: user.prenom, role: user.role },
    };
  }

  async validateUser(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }
}
