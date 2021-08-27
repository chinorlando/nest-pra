import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { User } from 'src/user/models/user.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrderService extends AbstractService {
    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>
    ){
        super(orderRepository);
    }

    async paginate(page = 1, relations=[]): Promise<any>{
        const {data, meta} = await super.paginate(page, relations);
        
        return {
            // mapeamos cuando no intercepamos y ocultar el campo password
            data:data.map((order: Order) => ({
                id: order.id,
                name: order.name,
                email: order.email,
                total: order.total,
                created_at: order.created_at,
                order_items: order.order_items
            })),
            meta,
        }
    }

    async chart(){
        return await this.orderRepository.query(`
            select to_char(o.created_at ,'YYYY-MM-DD') as data, sum(i.price*i.quantity) as sum from orders o 
            join order_items i on i.order_id = o.id 
            group by data
        `);
    }
}
