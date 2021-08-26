import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginateResult } from './paginated-result.interface';

@Injectable()
export abstract class AbstractService {

    protected constructor(protected readonly repository: Repository<any>){}

    async all(relations=[]): Promise<any[]>{
        return await this.repository.find({relations});
    }

    async paginate(page = 1, relations=[]): Promise<PaginateResult>{
        const take = 2;
        const [data, total] = await this.repository.findAndCount({
            take,
            skip: (page-1)*take,
            relations
        });
        return {
            // mapeamos cuando no intercepamos y ocultar el campo password
            data:data,
            meta:{
                total,
                page,
                last_page: Math.ceil(total/take),
            },
        }
    }

    async create(data): Promise<any>{
        return await this.repository.save(data);
    }

    // async findOne(condition): Promise<any>{
    //     return await this.repository.findOne(condition);
    // }

    async findOne(condition, relations=[]): Promise<any>{
        return await this.repository.findOne(condition, {relations});
    }

    async update(id:number, data):Promise<any>{
        return this.repository.update(id, data);
    }

    async delete(condition): Promise<any>{
        return await this.repository.delete(condition);
    }

}
