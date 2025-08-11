import { Reflector } from '@nestjs/core'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            throw err || new UnauthorizedException()
        }
        const roles = this.reflector.get<string[]>('roles', context.getHandler()) || []
        const hasPermission = roles.length === 0 || roles.includes(user?.role?.key)
        if (!hasPermission) {
            throw new ForbiddenException('Acceso denegado')
        }
        context.switchToHttp().getRequest().user = user

        return user
    }
}
