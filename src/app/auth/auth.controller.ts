import { AuthService } from 'src/app/auth/auth.service'
import { LoginAuthDto } from 'src/app/auth/dto/login-auth.dto'
import { CreateUserDto } from 'src/app/users/dto/create-user.dto'
import { Controller, Post, Body, HttpCode } from '@nestjs/common'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @Post('login')
  @HttpCode(200)
  loginUser(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto)
  }

}
