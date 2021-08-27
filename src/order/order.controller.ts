import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderItem } from './order-item.entity';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { Parser } from 'json2csv';
import { Response } from 'express';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService){}

    @Get()
    async all(@Query('page') page=1){
        // return await this.orderService.all(['order_items']);
        return await this.orderService.paginate(page,['order_items']);
    }

    @Post('export')
    async export(@Res() res: Response){
        const parser = new Parser({
            fields: ['ID','Name','Email','Product Title','Price','Quantity'],
        });
        const orders = this.orderService.all(['order_items']);
        const json=[];

        (await orders).forEach((o: Order)=>{
            json.push({
                ID: o.id,
                Name: o.name,
                Email: o.email,
                'Product Title': '',
                Price: '',
                Quantity: '',
            });
            o.order_items.forEach((i: OrderItem)=>{
                json.push({
                    ID: '',
                    Name: '',
                    Email: '',
                    'Product Title': i.product_title,
                    Price: i.price,
                    Quantity: i.quantity,
                });
            });
        });

        const csv = parser.parse(json);
        res.header('Content-Type', 'Text/csv');
        res.attachment('orders.csv');
        return res.send(csv);
    }

}
