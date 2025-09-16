import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { AuthGuard } from '../auth/auth.guard'; //  existing guard

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // -------------------- Create Product --------------------
  @UseGuards(AuthGuard)
  @Post('create')
  createProduct(@Body() data: Partial<ProductEntity>, @Request() req) {
    const sellerId = req.user.sub; // use sub from JWT payload
    return this.productService.createProduct(data, sellerId);
  }

  // -------------------- Get All Products --------------------
  @Get('all')
  getProductInfo() {
    return this.productService.getProductInfo();
  }



  @Get('onlyseller/:id')
  getonlysellername(@Param('id', ParseIntPipe) id: number) { 
  
    return this.productService.getOnlySellerName(id);
  }


 
//------------------- Get Product By ID --------------------
  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProductById(id);
  }

  // -------------------- Update Product --------------------
  @UseGuards(AuthGuard)
  @Put('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<ProductEntity>,
    @Request() req,
  ) {
    const sellerId = req.user.sub;
    return this.productService.updateProduct(id, data, sellerId);
  }

  // -------------------- Delete Product --------------------
  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  deleteProductById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const sellerId = req.user.sub;
    return this.productService.deleteProductById(id, sellerId);
  }

  
 


}
