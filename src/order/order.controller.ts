import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderService } from './order.service';

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

    // @Post()
    // async create(@Body() body: ProductCreateDto){
    //     return this.orderService.create(body);
    // }

    // @Get(':id')
    // async get(@Param('id') id:number){
    //     return await this.orderService.findOne({id});
    // }

    // @Put(':id')
    // async update(
    //     @Param('id') id:number,
    //     @Body() body: ProductUpdateDto,
    // ){
    //     await this.orderService.update(id, body);
    //     return this.orderService.findOne({id});
    // }

    // @Delete(':id')
    // async delete(@Param('id') id:number){
    //     return this.orderService.delete(id);
    // }
}
