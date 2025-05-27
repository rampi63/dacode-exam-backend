import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GqlAuthGuard } from './guards/gql-auth.guards';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthResolver, AuthService, GqlAuthGuard]
})
export class AuthModule {}
