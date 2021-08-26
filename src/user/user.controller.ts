import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    async all(): Promise<User[]>{
        return await this.userService.all();
    }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User>{
        const password = await bcrypt.hash('123456', 12);
        return await this.userService.create({
            first_name: body.first_name,
            last_name: body.last_name,
            email:body.email,
            password
        });
    }

    @Get(':id')
    async get(@Param('id') id:number){
        return this.userService.findOne({id});
    }
}
