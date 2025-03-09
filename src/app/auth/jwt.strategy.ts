import { ConfigService } from '@nestjs/config'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { UsersService } from 'src/app/users/users.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService, private userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
        })
    }

    async validate(payload: any) {
        const user = await this.userService.findOne(payload.userId)
        if (!user.isActive) {
            throw new UnauthorizedException('User is not active')
        }
        return user
    }
}