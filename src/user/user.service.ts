import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService extends AbstractService{
    constructor (@InjectRepository(User) private readonly userRepository: Repository<User>){
        super(userRepository);
    }
    
    // async all(): Promise<User[]>{
    //     return await this.userRepository.find();
    // }

    async paginate(page = 1, relations=[]): Promise<any>{
        const {data, meta} = await super.paginate(page, relations);
        
        return {
            // mapeamos cuando no intercepamos y ocultar el campo password
            data:data.map(user => {
                const {password, ...data} = user;
                return data;
            }),
            meta,
        }
    }

    // async create(data): Promise<User>{

    //     return await this.userRepository.save(data);
    // }

    // async findOne(condition): Promise<User>{
    //     return await this.userRepository.findOne(condition);
    // }

    // async update(id:number, data):Promise<any>{
    //     return this.userRepository.update(id, data);
    // }

    // async delete(condition): Promise<any>{
    //     return await this.userRepository.delete(condition);
    // }
}
