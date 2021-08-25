import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';

@Controller('register')
export class AuthController {
    constructor(private userService: UserService){}


    @Post()
    async register(@Body() body:RegisterDto){
        if (body.password !== body.password_confirm) {
            throw new BadRequestException("Contraseña con coincide");
        }
        const hashedPassword = await bcrypt.hash(body.password, 12);
        return await this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email: body.email,
            password: hashedPassword
        });
    }
}
