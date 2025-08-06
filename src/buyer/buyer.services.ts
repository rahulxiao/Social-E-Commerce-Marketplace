import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { CreateBuyerDto, UpdateBuyerDto, UpdatePhoneDto } from "./buyer.dto";
import { BuyerEntity } from "./buyer.entity";

@Injectable()
export class BuyerService {
    constructor(
        @InjectRepository(BuyerEntity)
        private readonly buyerRepository: Repository<BuyerEntity>
    ) {}

    // Create a user
    async createBuyer(createBuyerDto: CreateBuyerDto) {
        try {
            // Convert empty fullName to null
            const processedData = {
                ...createBuyerDto,
                fullName: createBuyerDto.fullName?.trim() || undefined,
                isActive: createBuyerDto.isActive ?? true
            };

            const buyer = this.buyerRepository.create(processedData);
            const savedBuyer = await this.buyerRepository.save(buyer);
            
            return { 
                success: true,
                message: "Buyer created successfully",
                data: savedBuyer
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to create buyer",
                error: error.message
            };
        }
    }

    // Modify the phone number of an existing user
    async updatePhone(id: number, updatePhoneDto: UpdatePhoneDto) {
        const buyer = await this.buyerRepository.findOne({ where: { id } });
        if (!buyer) {
            throw new NotFoundException(`Buyer with ID ${id} not found`);
        }
        
        buyer.phone = updatePhoneDto.phone;
        const updatedBuyer = await this.buyerRepository.save(buyer);
        
        return {
            message: "Phone number updated successfully",
            data: updatedBuyer
        };
    }

    // Retrieve users with null values in the full name column
    async getBuyersWithNullFullName() {
        try {
            const buyers = await this.buyerRepository.find({
                where: { fullName: IsNull() }
            });
            
            return {
                success: true,
                message: "Buyers with null full name retrieved successfully",
                count: buyers.length,
                data: buyers
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to retrieve buyers with null full name",
                error: error.message
            };
        }
    }

    // Remove a user from the system based on their id
    async removeBuyer(id: number) {
        const buyer = await this.buyerRepository.findOne({ where: { id } });
        if (!buyer) {
            throw new NotFoundException(`Buyer with ID ${id} not found`);
        }
        
        await this.buyerRepository.remove(buyer);
        
        return {
            message: `Buyer with ID ${id} removed successfully`
        };
    }


    async updateBuyer(id: number, updateBuyerDto: UpdateBuyerDto) {
        const buyer = await this.buyerRepository.findOne({ where: { id } });
        if (!buyer) {
            throw new NotFoundException(`Buyer with ID ${id} not found`);
        }
        
        Object.assign(buyer, updateBuyerDto);
        const updatedBuyer = await this.buyerRepository.save(buyer);
        
        return { 
            message: "Buyer updated successfully",
            data: updatedBuyer
        };
    }

    async getBuyerById(id: number) {
        const buyer = await this.buyerRepository.findOne({ where: { id } });
        if (!buyer) {
            throw new NotFoundException(`Buyer with ID ${id} not found`);
        }
        
        return {
            message: "Buyer retrieved successfully",
            data: buyer
        };
    }

    async getBuyerByUniqueId(uniqueId: string) {
        const buyer = await this.buyerRepository.findOne({ where: { uniqueId } });
        if (!buyer) {
            throw new NotFoundException(`Buyer with UUID ${uniqueId} not found`);
        }
        
        return {
            message: "Buyer retrieved successfully by UUID",
            data: buyer
        };
    }

    async getAllBuyers() {
        const buyers = await this.buyerRepository.find();
        return {
            message: "All buyers retrieved successfully",
            count: buyers.length,
            data: buyers
        };
    }

    // Legacy methods for compatibility
    getBuyerInfo() {
        return { message: "Buyer information" };
    }

    deleteBuyer() {
        return { message: "Buyer deleted successfully" };
    }

    createPost() {
        return { message: 'Post created successfully' };
    }

    getPosts() {
        return { message: 'List of posts' };
    }

    deletePost(postId: string) {
        return { message: `Post with ID ${postId} deleted successfully` };
    }

    likePost(postId: string) {
        return { message: `Liked post with ID ${postId}` };
    }

    unlikePost(postId: string) {
        return { message: `Unliked post with ID ${postId}` };
    }

    follow(buyerId: string) {
        return { message: `Followed buyer with ID ${buyerId}` };
    }

    unfollow(buyerId: string) {
        return { message: `Unfollowed buyer with ID ${buyerId}` };
    }

    uploadFile(file: Express.Multer.File) {
        return {
            message: 'File uploaded successfully',
            fileDetails: {
                originalName: file.originalname,
                fileName: file.filename,
                path: file.path,
                size: file.size,
                mimetype: file.mimetype,
            },
        };
    }
}