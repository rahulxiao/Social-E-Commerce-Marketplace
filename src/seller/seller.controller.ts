import { Controller, Delete, Get, Post } from "@nestjs/common";
import { SellerService } from "./seller.services";

@Controller('seller')
export class SellerController {
    constructor(private readonly sellerService : SellerService) {}
    @Get('getSellerInfo')
    getSellerInfo() {
        return this.sellerService.getSellerInfo();
    }
    @Post('sellerUser')
    createSeller() {
        return this.sellerService.createSeller();
    }
    @Delete('deleteSeller')
    deleteUser() {
        return this.sellerService.createSeller(); 
    }
}