import {Controller,Delete,Get,Param,Post,Put,Query,Body,UseGuards,Request,ParseIntPipe,UploadedFile,UseInterceptors,Patch,} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductEntity } from './product.entity';
import { AuthGuard } from '../auth/auth.guard'; //  existing guard
import { diskStorage } from 'multer';
import { extname } from 'path';

// -------------------- Create Product --------------------

@Controller('product')
export class ProductController {
  // -------------------- Get Products By Seller --------------------
  @UseGuards(AuthGuard)
  @Get('seller/:sellerId')
  getProductsBySeller(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return this.productService.getProductsBySeller(sellerId);
  }
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  createProduct(
    @Body() data: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const sellerId = req.user.sub;
    return this.productService.createProduct(data, sellerId, file);
  }

  // -------------------- Get All Products --------------------
  @UseGuards(AuthGuard)
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
  @Patch('update/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<ProductEntity>,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const sellerId = req.user.sub;
    if (file) {
      data.image = file.filename;
    }
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
