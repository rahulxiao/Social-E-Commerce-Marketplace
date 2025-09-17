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
  
  // ---------- New: Filtered list with pagination ----------
  @Get('list')
  list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('inStock') inStock?: string,
    @Query('sortBy') sortBy?: 'createdAt' | 'price' | 'title' | 'id',
    @Query('sortDir') sortDir?: 'ASC' | 'DESC',
  ) {
    return this.productService.listProducts({
      page: Number(page) || undefined,
      limit: Number(limit) || undefined,
      category,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
      inStock: inStock !== undefined ? (inStock === 'true' || inStock === '1') : undefined,
      sortBy,
      sortDir,
    });
  }

  // ---------- New: Search ----------
  @Get('search')
  search(
    @Query('q') q: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: 'createdAt' | 'price' | 'title' | 'id',
    @Query('sortDir') sortDir?: 'ASC' | 'DESC',
  ) {
    return this.productService.searchProducts({ q, page: Number(page) || undefined, limit: Number(limit) || undefined, sortBy, sortDir });
  }

  // ---------- New: Review stats ----------
  @Get(':id/review-stats')
  getReviewStats(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getReviewStats(id);
  }

  // ---------- New: Stock management ----------
  @UseGuards(AuthGuard)
  @Put(':id/stock')
  setStock(@Param('id', ParseIntPipe) id: number, @Query('value') value: string) {
    return this.productService.setStock(id, Number(value));
  }

  @UseGuards(AuthGuard)
  @Put(':id/stock/delta')
  changeStock(@Param('id', ParseIntPipe) id: number, @Query('delta') delta: string) {
    return this.productService.changeStock(id, Number(delta));
  }

  @UseGuards(AuthGuard)
  @Put(':id/in-stock')
  setInStock(@Param('id', ParseIntPipe) id: number, @Query('value') value: string) {
    const v = value === 'true' || value === '1';
    return this.productService.setInStock(id, v);
  }
}
