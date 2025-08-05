import { Controller, Delete, Get, Post, Param, UploadedFile, UseInterceptors, Res, Body, HttpException, HttpStatus, Put, ValidationPipe } from "@nestjs/common";
import { BuyerService } from "./buyer.services";
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { CreateBuyerDto, UpdateBuyerDto, UpdatePhoneDto } from './buyer.dto';

@Controller('buyer')
export class BuyerController {
    constructor(private readonly buyerService: BuyerService) {}

    @Post('create')
    createBuyer(@Body(ValidationPipe) createBuyerDto: CreateBuyerDto) {
        return this.buyerService.createBuyer(createBuyerDto);
    }

    @Put('updatePhone/:id')
    updatePhone(@Param('id') id: number, @Body(ValidationPipe) updatePhoneDto: UpdatePhoneDto) {
        return this.buyerService.updatePhone(id, updatePhoneDto);
    }

    @Get('nullFullName')
    getBuyersWithNullFullName() {
        return this.buyerService.getBuyersWithNullFullName();
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

    @Put('update/:id')
    updateBuyer(@Param('id') id: number, @Body() updateBuyerDto: UpdateBuyerDto) {
        return this.buyerService.updateBuyer(id, updateBuyerDto);
    }

    // Legacy endpoints for compatibility
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
        // Note: This legacy endpoint requires id to be passed in the body
        // For proper usage, use PUT /buyer/update/:id instead
        return this.buyerService.updateBuyer(1, updateBuyerDto); // Default to ID 1 for legacy compatibility
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
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueName = Date.now() + '-' + file.originalname;
                cb(null, uniqueName);
            },
        }),
        fileFilter: (req, file, cb) => {
            // Check if file exists
            if (!file) {
                return cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'No file uploaded'), false);
            }
            
            // Check file extension
            const isPdfExtension = file.originalname.toLowerCase().endsWith('.pdf');
            if (!isPdfExtension) {
                return cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'Only PDF files are allowed'), false);
            }
            
            // Check MIME type for additional security
            const isPdfMimeType = file.mimetype === 'application/pdf';
            if (!isPdfMimeType) {
                return cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type. Only PDF files are allowed'), false);
            }
            
            // File is valid, allow upload
            cb(null, true);
        },
        limits: { 
            fileSize: 500000, // 500KB
            files: 1 // Only allow 1 file
        }
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        try {
            if (!file) {
                throw new HttpException('No file uploaded. Please select a PDF file.', HttpStatus.BAD_REQUEST);
            }
            
            // Additional validation (redundant but safe)
            const isPdfExtension = file.originalname.toLowerCase().endsWith('.pdf');
            const isPdfMimeType = file.mimetype === 'application/pdf';
            
            if (!isPdfExtension || !isPdfMimeType) {
                throw new HttpException('Only PDF files are allowed', HttpStatus.BAD_REQUEST);
            }
            
            return this.buyerService.uploadFile(file);
        } catch (error) {
            if (error instanceof MulterError) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
            throw error;
        }
    }

    @Get('getfile/:name')
    getFile(@Param('name') name: string, @Res() res) {
        res.sendFile(name, { root: './uploads' });
    }
}

