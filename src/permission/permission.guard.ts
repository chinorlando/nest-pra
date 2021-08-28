import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { Role } from 'src/role/role.entity';
import { RoleService } from 'src/role/role.service';
import { User } from 'src/user/models/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
  ){}

  async canActivate(
    context: ExecutionContext,
  ){
    const access = this.reflector.get<string>('access', context.getHandler());
    if (!access) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const id = await this.authService.userId(request);
    const user: User = await this.userService.findOne({id}, ['role']);
    const roles: Role = await this.roleService.findOne({id: user.role.id}, ['permissions']);
    const role = await this.roleService.findOne({id: user.role.id}, ['permissions']);
    
    
    // console.log(role);
    // console.log(roles);
    // const rol = role.permissions;
    if (request.method === 'GET') {
      return role.permissions.some(p => (p.name === `view_${access}`) || (p.name === `edit_${access}`));
    }
    return role.permissions.some(p => p.name === `view_${access}`);

    // console.log(access);
    // const rol = role.permissions;
    // console.log(rol);
    // const ro =  rol.some(p => p.name === `${access}`);
    // console.log(ro);
    
    // return true;

  }
}
