import { Controller, Delete, Get, Post, Param, UploadedFile, UseInterceptors, Res, Body, HttpException, HttpStatus, Put, ValidationPipe, UseGuards, Request } from "@nestjs/common";
import { BuyerService } from "./buyer.services";
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { CreateBuyerDto, UpdateBuyerDto, UpdatePhoneDto, BuyerProfileUpdateDto } from './buyer.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('buyer')
export class BuyerController {
    constructor(private readonly buyerService: BuyerService) {}


    // Profile
    @UseGuards(AuthGuard)
    @Get('me')
    me(@Request() req) { return this.buyerService.getProfile(req.user.sub); }

    @UseGuards(AuthGuard)
    @Put('profile')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
        })
    }))
    updateProfile(
        @Request() req,
        @Body(ValidationPipe) dto: BuyerProfileUpdateDto,
        @UploadedFile() avatar?: Express.Multer.File,
    ) { return this.buyerService.updateProfile(req.user.sub, dto, avatar); }

    @Post('create')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(pdf)$/)) {
                cb(null, true);
            } else {
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
            }
        },
        limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
        storage: diskStorage({
            destination: './uploads',
            filename: function (req, file, cb) {
                cb(null, Date.now() + file.originalname);
            },
        })
    }))
    createBuyer(
        @Body(ValidationPipe) createBuyerDto: CreateBuyerDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        createBuyerDto.pdf = file;
        return this.buyerService.createBuyer(createBuyerDto);
    }

    @Put('updatePhone/:id')
    updatePhone(@Param('id') id: number, @Body(ValidationPipe) updatePhoneDto: UpdatePhoneDto) {
        return this.buyerService.updatePhone(id, updatePhoneDto);
    }

    @Get('nullFullName')
    async getBuyersWithNullFullName() {
        try {
            return await this.buyerService.getBuyersWithNullFullName();
        } catch (error) {
            return {
                success: false,
                message: "Failed to retrieve buyers with null full name",
                error: (error as Error).message
            };
        }
    }

    @Delete('remove/:id')
    removeBuyer(@Param('id') id: number) {
        return this.buyerService.removeBuyer(id);
    }

    @Get('all')
    getAllBuyers() {
        return this.buyerService.getAllBuyers();
    }

    @Get('get/:id')
    getBuyerById(@Param('id') id: number) {
        return this.buyerService.getBuyerById(id);
    }

    @Get('getByUuid/:uniqueId')
    getBuyerByUniqueId(@Param('uniqueId') uniqueId: string) {
        return this.buyerService.getBuyerByUniqueId(uniqueId);
    }

    @Put('update/:id')
    updateBuyer(@Param('id') id: number, @Body() updateBuyerDto: UpdateBuyerDto) {
        return this.buyerService.updateBuyer(id, updateBuyerDto);
    }

    @Get('getBuyerInfo')
    getBuyerInfo() {
        return this.buyerService.getBuyerInfo();
    }

    @Post('createBuyer')
    createBuyerLegacy(@Body() createBuyerDto: CreateBuyerDto) {
        return this.buyerService.createBuyer(createBuyerDto);
    }

    @Post('updateBuyer')
    updateBuyerLegacy(@Body() updateBuyerDto: UpdateBuyerDto) {
       
        return this.buyerService.updateBuyer(1, updateBuyerDto); 
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
            if (file.originalname.match(/^.*\.(pdf)$/)) {
                cb(null, true);
            } else {
                cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'pdf'), false);
            }
        },
        limits: { fileSize: 30 * 1024 * 1024 },
        storage: diskStorage({
            destination: './uploads',
            filename: function (req, file, cb) {
                cb(null, Date.now() + file.originalname);
            },
        })
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
    }

    @Get('getfile/:name')
    getFile(@Param('name') name: string, @Res() res) {
        res.sendFile(name, { root: './uploads' });
    }
}

