import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService){}

    // @Get()
    // async all(): Promise<User[]>{
    //     return await this.userService.all();
    //     return await this.userService.paginate();
    // }

    @Get()
    async all(@Query('page') page = 1): Promise<User[]>{
        return await this.userService.paginate(page);
    }

    // manera larga
    // @Post()
    // async create(@Body() body: UserCreateDto): Promise<User>{
    //     const password = await bcrypt.hash('123456', 12);
    //     return await this.userService.create({
    //         first_name: body.first_name,
    //         last_name: body.last_name,
    //         email:body.email,
    //         password,
    //         role_id: body.role_id,
    //     });
    // }
    // manera corta
    @Post()
    async create(@Body() body: UserCreateDto): Promise<User>{
        const password = await bcrypt.hash('123456', 12);
        const {role_id, ...data} = body;
        return await this.userService.create({
            ...data,
            password,
            role: {id: role_id},
        });
    }


    @Get(':id')
    async get(@Param('id') id:number){
        return this.userService.findOne({id});
    }

    // manera larga
    // @Put(':id')
    // async update(
    //     @Param('id') id:number,
    //     @Body() body:UserUpdateDto
    // ){
    //     await this.userService.update(id, body);
    //     return this.userService.findOne({id});
    // }

    // manera corta
    @Put(':id')
    async update(
        @Param('id') id:number,
        @Body() body:UserUpdateDto
    ){
        const {role_id, ...data} = body;
        await this.userService.update(id, {
            ...data,
            role: {id: role_id}
        });
        return this.userService.findOne({id});
    }

    @Delete(':id')
    async delete(@Param('id') id:number){
        return this.userService.delete({id});
    }
}
