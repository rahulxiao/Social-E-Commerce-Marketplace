import {Body,Controller,Delete,Param,Post,Query,Patch,Get,Put,ParseIntPipe,UseInterceptors,UploadedFile} from '@nestjs/common';
import { SellerService } from './seller.services';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError } from 'multer';
import { CreateSellerDto } from './seller.dto';
import { UpdateSellerDto } from './seller.dto';
import { SellerEntity } from './seller.entity';
import { extname } from 'path';
import { diskStorage } from 'multer';



@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('getSellerInfo')
  async getSellerInfo() {
    return await this.sellerService.getSellerInfo();
  }

  @Get('getSellerById/:id')
  async getSellerById(@Param('id', ParseIntPipe) id: number) {
    return await this.sellerService.getSellerById(id);
  }

  @Post('createSeller')
 
  @UseInterceptors(
  FileInterceptor('nidImage', {
    storage: diskStorage({
      destination: './uploads/nid',
      filename: (req, file, cb) => {
        const uniqueName =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueName + extname(file.originalname));
      },
    }),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'nidImage'), false);
      }
    },
  }),
)
  async createSeller(@UploadedFile() file: Express.Multer.File,@Body() dto: CreateSellerDto,) {
    return this.sellerService.createSeller(dto, file);
  }

  @Delete('deleteSellerById/:id')
    async deleteSellerById(@Param('id') id: string) {
        return await this.sellerService.deleteSellerById(id);
    }

    
    @Put('updateSeller/:id')
    async updateSeller(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: UpdateSellerDto
    ) {
        return await this.sellerService.updateSeller(id, updateData);
      }

    @Get('getSellerInfoByNameAndId')
    async getSellerByNameAndId(@Query('name') name: string, @Query('id') id: number) {
        return await this.sellerService.getSellerByNameAndId(name, id);
  }

  @Patch('updateStatus/:id')
   async updateStatus(@Param('id', ParseIntPipe) id: number,@Body() dto: UpdateSellerDto,) {
      return await this.sellerService.updateStatus(id, dto.status);
  }

  @Get('getInactiveSellers')
  async getInactiveSellers() {
     return await this.sellerService.getInactiveSellers();
  }

  @Get('getSellersAboveAge')
    async getSellersAboveAge(@Query('age') age: number = 40) {
      return await this.sellerService.getSellersAboveAge(age);
  }

  

    
    
}

