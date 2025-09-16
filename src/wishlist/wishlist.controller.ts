import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Request, ValidationPipe, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AuthGuard } from '../auth/auth.guard';
import { AddToWishlistDto, UpdateWishlistItemDto } from './wishlist.dto';

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post('add')
  addToWishlist(@Request() req, @Body(ValidationPipe) addToWishlistDto: AddToWishlistDto) {
    return this.wishlistService.addToWishlist(req.user.sub, addToWishlistDto);
  }

  @Get()
  getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.sub);
  }

  @Put('item/:itemId')
  updateWishlistItem(
    @Request() req,
    @Param('itemId') itemId: number,
    @Body(ValidationPipe) updateDto: UpdateWishlistItemDto,
  ) {
    return this.wishlistService.updateWishlistItem(req.user.sub, itemId, updateDto);
  }

  @Delete('item/:itemId')
  removeFromWishlist(@Request() req, @Param('itemId') itemId: number) {
    return this.wishlistService.removeFromWishlist(req.user.sub, itemId);
  }

  @Delete('product/:productId')
  removeProductFromWishlist(@Request() req, @Param('productId') productId: number) {
    return this.wishlistService.removeProductFromWishlist(req.user.sub, productId);
  }

  @Get('check/:productId')
  checkProductInWishlist(@Request() req, @Param('productId') productId: number) {
    return this.wishlistService.isProductInWishlist(req.user.sub, productId);
  }

  @Delete('clear')
  clearWishlist(@Request() req) {
    return this.wishlistService.clearWishlist(req.user.sub);
  }
}
