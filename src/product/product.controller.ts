import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('createProduct')
  createProduct() {
    return this.productService.createProduct();
  }
  @Get('getProductInfo')
  getProductInfo() {
    return this.productService.getProductInfo();
  }
  @Get('/products')
  browseProducts() {
    return this.productService.browseProducts();
  }
  @Get('getProductsByCategory/:category')
  getProductsByCategory(
    @Param('category') category: string,
    @Query('sort') sort: string,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.productService.getProductsByCategory(
      category,
      sort,
      limit,
      page,
    );
  }
  @Get('getProductById/:id')
  getProductById(@Param('id') id: string) {
    return { message: `Product information for ID ${id}` };
  }
  @Delete('deleteProduct')
  deleteProduct() {
    return this.productService.deleteProduct();
  }
  @Put('updateProduct')
  update(@Param('id') id: string) {
    return { message: `Product with ID ${id} updated successfully` };
  }
  @Delete('deleteProductById/:id')
  deleteProductById(@Param('id') id: string) {
    return { message: `Product with ID ${id} deleted successfully` };
  }
}
