import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Controller('register')
export class AuthController {
    constructor(private userService: UserService){}

    @Post()
    async register(@Body() body){
        return await this.userService.create(body);
    }
}
