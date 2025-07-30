import { Controller, Delete, Get, Post, Param, UploadedFile, UseInterceptors, Res } from "@nestjs/common";
import { BuyerService } from "./buyer.services";
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError } from 'multer';
import { diskStorage } from 'multer';

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

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.pdf$/)) {
                cb(null, true);
            } else {
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
            }
        },
        limits: { fileSize: 500000 }, 
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, Date.now() + file.originalname);
            },
        }),
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return this.buyerService.uploadFile(file);
    }

    @Get('getfile/:name')
    getFile(@Param('name') name: string, @Res() res) {
        res.sendFile(name, { root: './uploads' });
    }
}