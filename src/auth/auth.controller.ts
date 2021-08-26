import { BadRequestException, Body, Controller, Get, NotFoundException, Post, Req, Res} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './models/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';


@Controller()
export class AuthController {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ){}


    @Post('register')
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

    @Post('login')
    async login(
        @Body('email') email:string, 
        @Body('password') password:string,
        @Res() response: Response
    ){
    // async login(@Body() body){
    // async login(@Query('email') email: string, @Query('password') pass: string){
    // async login(@Req() request: Request){
        const user = await this.userService.findOne({email});
        if (!user) {
            throw new NotFoundException("El usuario no existe");;
        }

        if (!await bcrypt.compare(password, user.password)) {
            throw new NotFoundException("Contraseña incorrecta");
        }

        const jwt = await this.jwtService.signAsync({id:user.id});
        response.cookie('jwt', jwt, {httpOnly:true});

        return user;
    }

    @Get('usero')
    async user(@Req() request: Request){
        const cookie = await request.cookies['jwt'];
        const data = await this.jwtService.verifyAsync(cookie);
        console.log(data);
        return this.userService.findOne({id: data['id']});
    }
}
