import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  addToCart() {
    return { message: 'Item added to cart' };
  }
}
