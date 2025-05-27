import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class GqlAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context).getContext();
        const token = ctx.req.cookies?.accessToken;

        if (!token) throw new UnauthorizedException('No accessToken cookie found');

        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });

            ctx.user = payload;

            return true;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
