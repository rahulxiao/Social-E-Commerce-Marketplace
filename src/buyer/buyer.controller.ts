import { Controller, Delete, Get, Post, Param } from "@nestjs/common";
import { BuyerService } from "./buyer.services";

@Controller('buyer')
export class BuyerController {
    constructor(private readonly buyerService: BuyerService) {}
    @Get('getBuyerInfo')
    getBuyerInfo() {
        return this.buyerService.getBuyerInfo();
    }
    @Post('createBuyer')
    createBuyer() {
        return this.buyerService.createBuyer();
    }
    @Delete('deleteBuyer')
    deleteBuyer() {
        return this.buyerService.deleteBuyer(); 
    }

    @Post('createPost')
    createPost() {
        return this.buyerService.createPost();
    }

    @Get('getPosts')
    getPosts() {
        return this.buyerService.getPosts();
    }

    @Delete('deletePost/:postId')
    deletePost(@Param('postId') postId: string) {
        return this.buyerService.deletePost(postId);
    }

    @Post('likePost/:postId')
    likePost(@Param('postId') postId: string) {
        return this.buyerService.likePost(postId);
    }

    @Post('unlikePost/:postId')
    unlikePost(@Param('postId') postId: string) {
        return this.buyerService.unlikePost(postId);
    }

    @Post('follow/:buyerId')
    follow(@Param('buyerId') buyerId: string) {
        return this.buyerService.follow(buyerId);
    }

    @Post('unfollow/:buyerId')
    unfollow(@Param('buyerId') buyerId: string) {
        return this.buyerService.unfollow(buyerId);
    }
}