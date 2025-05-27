import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    async register(email: string, password: string): Promise<void> {
        const existingUser = await this.userRepo.findOne({ where: { email } });

        if (existingUser) {
            throw new Error('Este correo ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepo.create({
            email,
            password: hashedPassword,
        });

        await this.userRepo.save(user);
    }

    async login(email: string, password: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { email } });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Contraseña incorrecta');
        }

        return user;
    }

    async setRefreshToken(userId: string, token: string) {
        const hash = await bcrypt.hash(token, 10);
        await this.userRepo.update(userId, { hashedRefreshToken: hash });
    }

    async validateRefreshToken(userId: string, token: string): Promise<User | null> {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user || !user.hashedRefreshToken) return null;

        const isMatch = await bcrypt.compare(token, user.hashedRefreshToken);
        return isMatch ? user : null;
    }

    async removeRefreshToken(userId: string) {
        await this.userRepo.update(userId, { hashedRefreshToken: "" });
    }

}
