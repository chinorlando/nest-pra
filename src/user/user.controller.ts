import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { HasPermission } from 'src/permission/has-permission.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
    ){}

    // @Get()
    // async all(): Promise<User[]>{
    //     return await this.userService.all();
    //     return await this.userService.paginate();
    // }

    // @Get()
    // async all(@Query('page') page = 1): Promise<User[]>{
    //     return await this.userService.paginate(page);
    // }

    @Get()
    // @HasPermission('view_users')
    @HasPermission('users')
    async all(@Query('page') page = 1){
        return await this.userService.paginate(page,['role']);
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
        return this.userService.findOne({id}, ['role']);
    }

    @Put('info')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UserUpdateDto
    ){
        const id = await this.authService.userId(request);
        await this.userService.update(id, body);
        return this.userService.findOne({id});
    }

    @Put('password')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string ,
        @Body('password_confirm') password_confirm: string
    ){
        if (password !== password_confirm) {
            throw new BadRequestException("Contraseña con coincide");
        }
        const id = await this.authService.userId(request);
        const hashed = await bcrypt.hash(password, 12);
        await this.userService.update(id, {
            password: hashed,
        });
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
