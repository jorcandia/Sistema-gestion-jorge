import { compare, hash } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from 'src/app/users/users.service'
import { LoginAuthDto } from 'src/app/auth/dto/login-auth.dto'
import { CreateUserDto } from 'src/app/users/dto/create-user.dto'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) {}

    async register(createUserDto: CreateUserDto) {
        const { password } = createUserDto
        const plaintToHash = await hash(password, 10)
        createUserDto = { ...createUserDto, password: plaintToHash }
        return this.usersService.create(createUserDto)
    }

    async login(loginAuthDto: LoginAuthDto) {
        const { email, password: received_password } = loginAuthDto
        const result = await this.usersService.findByEmail(email)
        if (!result) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        const checkPassword = await compare(received_password, result.password)
        if (!checkPassword) {
            throw new HttpException('Incorrect password', HttpStatus.FORBIDDEN)
        }
        const { password, ...user } = result
        if (!user.isActive) {
            throw new HttpException('Incorrect password', HttpStatus.UNAUTHORIZED)
        }
        const payload = { userId: user.id, role: user.role }
        const token = this.jwtService.sign(payload)
        return { user, token }
    }

}
