import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterResponse } from './dto/register-response.dto';
import { LoginResponse } from './dto/login.response.dto';
import { Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { GqlAuthGuard } from './guards/gql-auth.guards';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';

@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>
    ) { }

    @Mutation(() => RegisterResponse)
    async register(
        @Args('email') email: string,
        @Args('password') password: string,
    ): Promise<RegisterResponse> {
        try {
            await this.authService.register(email, password);
            return {
                success: true,
                message: 'Usuario registrado exitosamente. Por favor inicia sesión.',
            };
        } catch (err) {
            return {
                success: false,
                message: err.message || 'Error inesperado al registrar usuario.',
            };
        }
    }

    @Mutation(() => LoginResponse)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
        @Context() context: any,
    ): Promise<LoginResponse> {
        try {
            const user = await this.authService.login(email, password);

            const payload = { sub: user.id, email: user.email };

            const accessToken = this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m',
            });

            const refreshToken = this.jwtService.sign(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            });

            const res = context.req.res;

            const isProd = process.env.NODE_ENV === 'production';

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                sameSite: isProd ? 'lax' : 'none',
                secure: true,
                path: '/',
            });

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: isProd ? 'lax' : 'none',
                secure: true,
                path: '/',
            });

            await this.authService.setRefreshToken(user.id, refreshToken);

            return {
                success: true,
                message: 'Inicio de sesión exitoso',
            };
        } catch (err) {
            return {
                success: false,
                message: err.message || 'Error al iniciar sesión',
            };
        }
    }

    @Query(() => User)
    @UseGuards(GqlAuthGuard)
    async me(@Context() context: any): Promise<User> {
        const userId = context.user.sub;
        return await this.userRepo.findOneOrFail({ where: { id: userId } });
    }

    @Mutation(() => Boolean)
    async refreshToken(@Context() context: any): Promise<boolean> {
        const req = context.req;
        const res = context.req.res;
        const isProd = process.env.NODE_ENV === 'production';

        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) throw new Error('No refresh token');

        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const user = await this.authService.validateRefreshToken(
                payload.sub,
                refreshToken,
            );
            if (!user) throw new Error('Invalid refresh token');

            const newPayload = { sub: user.id, email: user.email };

            const newAccessToken = this.jwtService.sign(newPayload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '15m',
            });

            const newRefreshToken = this.jwtService.sign(newPayload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            });

            await this.authService.setRefreshToken(user.id, newRefreshToken);

            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                sameSite: isProd ? 'lax' : 'none',
                secure: true,
                path: '/',
            });

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                sameSite: isProd ? 'lax' : 'none',
                secure: true,
                path: '/',
            });

            return true;
        } catch {
            throw new Error('Invalid or expired refresh token');
        }
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAuthGuard)
    async logout(@Context() context: any): Promise<boolean> {
        const userId = context.user.sub;
        const res = context.req.res;

        await this.authService.removeRefreshToken(userId);

        console.log('Clearing cookies for user:', userId);

        res.clearCookie('accessToken', { path: '/' });
        res.clearCookie('refreshToken', { path: '/' });

        return true;
    }
}
