import { Controller, Delete, Get, Post, Query, Body } from "@nestjs/common";
import { SellerService } from "./seller.services";

@Controller('seller')
export class SellerController {
    constructor(private readonly sellerService : SellerService) {}
    @Get('getSellerInfo')
    getSellerInfo() {
        return this.sellerService.getSellerInfo();
    }
    @Get('getSellerById')
    getSellerById(@Query('id') id: number) {
        return this.sellerService.getSellerById(id);
    }
    @Post('CreateSeller')
    createSeller() {
        return this.sellerService.createSeller();
    }
    @Post('updateSeller')
    updateSeller(@Body('id') id: number, @Body('name') name: string) {
        return this.sellerService.updateSeller(id, name);
    }
    //Commit test  ogggaaa boooogaaa

    @Delete('deleteSeller')
    deleteSeller() {
        return this.sellerService.deleteSeller(); 
    }
}