import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
    placeOrder() {
        return { message: 'Order placed successfully' };
    }
    getOrders() {
        return { message: 'List of your orders' };
    }
} 