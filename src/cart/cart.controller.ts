import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/auth.guard';
import { AddToCartDto, UpdateCartItemDto } from './cart.dto';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Request() req, @Body(ValidationPipe) addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.sub, addToCartDto);
  }

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.sub);
  }

  @Put('item/:itemId')
  updateCartItem(
    @Request() req,
    @Param('itemId') itemId: number,
    @Body(ValidationPipe) updateDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.sub, itemId, updateDto);
  }

  @Delete('item/:itemId')
  removeFromCart(@Request() req, @Param('itemId') itemId: number) {
    return this.cartService.removeFromCart(req.user.sub, itemId);
  }

  @Delete('clear')
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.sub);
  }
}
