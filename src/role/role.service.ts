import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}

    async all(): Promise<Role[]>{
        return await this.roleRepository.find();
    }

    // async paginate(page = 1): Promise<any>{
    //     const take = 15;
    //     const [users, total] = await this.userRepository.findAndCount({
    //         take,
    //         skip: (page-1)*take,
    //     });
    //     return {
    //         // mapeamos cuando no intercepamos y ocultar el campo password
    //         data:users.map(user => {
    //             const {password, ...data} = user;
    //             return data;
    //         }),
    //         meta:{
    //             total,
    //             page,
    //             last_page: Math.ceil(total/take),
    //         }
    //     }
    // }

    async create(data): Promise<Role>{
        return await this.roleRepository.save(data);
    }

    async findOne(condition): Promise<Role>{
        return await this.roleRepository.findOne(condition, {relations: ['permissions']} );
    }

    async update(id:number, data):Promise<any>{
        return this.roleRepository.update(id, data);
    }

    async delete(condition): Promise<any>{
        return await this.roleRepository.delete(condition);
    }
}
