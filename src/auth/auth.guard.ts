import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtServices: JwtService){}

  canActivate(context: ExecutionContext,){
    const request = context.switchToHttp().getRequest();
    
    try {
      const jwt = request.cookies['jwt'];
      return this.jwtServices.verify(jwt);
    } catch (error) {
      return false;
    }
  }
}
