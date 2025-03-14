import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/app/auth/jwt.strategy";
import { AuthService } from "src/app/auth/auth.service";
import { UsersModule } from "src/app/users/users.module";
import { AuthController } from "src/app/auth/auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RolesModule } from "../roles/roles.module";

@Module({
  imports: [
    UsersModule,
    RolesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET_KEY"),
        signOptions: { expiresIn: "12h" },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
