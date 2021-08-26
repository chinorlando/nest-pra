import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import * as bcrypt from 'bcrypt';
import { RoleCreateDto } from './models/role-create.dto';
import { RoleUpdateDto } from './models/role-update.dto';
import { Permission } from 'src/permission/permission.entity';

@Controller('roles')
export class RoleController {
    constructor(private roleService: RoleService){}
    
    @Get()
    async all(): Promise<Role[]>{
        return await this.roleService.all();
    }

    // @Get()
    // async all(@Query('page') page = 1): Promise<Role[]>{
    //     return await this.roleService.paginate(page);
    // }

    // hasta video 22
    // @Post()
    // async create(@Body() body: RoleCreateDto): Promise<Role>{
    //     const password = await bcrypt.hash('123456', 12);
    //     return await this.roleService.create({
    //         name: body.name,
    //     });
    // }

    @Post()
    async create(
        @Body() body: RoleCreateDto,
        @Body('permissions') ids:number[]
    ): Promise<Role>{
        const password = await bcrypt.hash('123456', 12);
        /**
         * ids.map(id => {id})
         * devuelve lo de abajo
         * [1,2]
         * [{id:1}, {id:2}]
         */
        return await this.roleService.create({
            name: body.name,
            permissions: ids.map(id => ({id})),
        });
    }    

    @Get(':id')
    async get(@Param('id') id:number){
        return this.roleService.findOne({id}, ['permissions']);
    }

    // @Put(':id')
    // async update(
    //     @Param('id') id:number,
    //     @Body() body:RoleUpdateDto
    // ){
    //     await this.roleService.update(id, body);
    //     return this.roleService.findOne({id});
    // }

    @Put(':id')
    async update(
        @Param('id') id:number,
        @Body() body:RoleUpdateDto,
        @Body('permissions') ids:number[]
    ){
        await this.roleService.update(id, {
            name: body.name,
            permissions: ids.map(id => ({id})),
        });
        return this.roleService.findOne({id});
    }

    @Delete(':id')
    async delete(@Param('id') id:number){
        return this.roleService.delete({id});
    }
}
