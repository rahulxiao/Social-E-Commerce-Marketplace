import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SellerEntity } from './seller.entity';
import { CreateSellerDto } from './seller.dto';
import { UpdateSellerDto } from './seller.dto';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(SellerEntity)
    private sellerRepository: Repository<SellerEntity>,
  ) {}

  async getSellerInfo() {
    try {
      const sellers = await this.sellerRepository.find();
      return {
        success: true,
        message: 'Seller information retrieved successfully',
        data: sellers,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve seller information',
        error: error.message,
      };
    }
  }

  async getSellerById(id: number) {
    try {
      const seller = await this.sellerRepository.findOne({ where: { id } });
      if (seller) {
        return {
          success: true,
          message: 'Seller found',
          data: seller,
        };
      } else {
        return {
          success: false,
          message: 'Seller not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve seller',
        error: error.message,
      };
    }
  }

  async createSeller(dto: CreateSellerDto, file: Express.Multer.File) {
    try {
      const seller = this.sellerRepository.create({
        name: dto.name,
        email: dto.email,
        nidNumber: dto.nidNumber,
        nidImage: file.path,
        age: dto.age,
        status: dto.status || 'active',
        // Add password only if it exists in CreateSellerDto
        ...(dto.password && { password: dto.password }),
      });
      const savedSeller = await this.sellerRepository.save(seller);
      return {
        success: true,
        message: 'Seller created successfully',
        data: savedSeller,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create seller',
        error: error.message,
      };
    }
  }

  async getSellersAboveAge(age: number) {
    try {
      const sellers = await this.sellerRepository
        .createQueryBuilder('seller')
        .where('seller.age > :age', { age })
        .getMany();

      return {
        success: true,
        message: `Sellers older than ${age} retrieved successfully`,
        data: sellers,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve sellers',
        error: error.message,
      };
    }
  }

  async getInactiveSellers() {
    try {
      const inactiveSellers = await this.sellerRepository.find({
        where: { status: 'inactive' },
      });
      return {
        success: true,
        message: 'Inactive sellers retrieved successfully',
        data: inactiveSellers,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve inactive sellers',
        error: error.message,
      };
    }
  }

  async deleteSellerById(id: string) {
    try {
      const result = await this.sellerRepository.delete(id);
      if (result.affected && result.affected > 0) {
        return {
          success: true,
          message: `Seller with ID ${id} deleted successfully`,
        };
      } else {
        return {
          success: false,
          message: 'Seller not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete seller',
        error: error.message,
      };
    }
  }

  async updateSeller(id: number, updateData: UpdateSellerDto) {
    try {
      const result = await this.sellerRepository.update(id, updateData);
      if (result.affected && result.affected > 0) {
        const updatedSeller = await this.sellerRepository.findOne({
          where: { id },
        });
        return {
          success: true,
          message: 'Seller updated successfully',
          data: updatedSeller,
        };
      } else {
        return {
          success: false,
          message: 'Seller not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update seller',
        error: error.message,
      };
    }
  }

  async addSellerBody(name: string, id: number) {
    try {
      const sellerData = { name, id } as Partial<SellerEntity>;
      const seller = this.sellerRepository.create(sellerData);
      const savedSeller = await this.sellerRepository.save(seller);
      return {
        success: true,
        message: `Seller body added for ${name} with ID ${id}`,
        data: savedSeller,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add seller',
        error: error.message,
      };
    }
  }

  async getSellerByNameAndId(name: string, id: number) {
    try {
      const seller = await this.sellerRepository.findOne({
        where: { name, id },
      });
      if (seller) {
        return {
          success: true,
          message: `Seller info for ${name} with ID ${id}`,
          data: seller,
        };
      } else {
        return {
          success: false,
          message: 'Seller not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve seller',
        error: error.message,
      };
    }
  }

  async updateStatus(id: number, status: string) {
    try {
      const seller = await this.sellerRepository.findOne({ where: { id } });

      if (seller) {
        seller.status = status;
        const updatedSeller = await this.sellerRepository.save(seller);

        return {
          success: true,
          message: `Seller status updated to '${status}' for ID ${id}`,
          data: updatedSeller,
        };
      } else {
        return {
          success: false,
          message: `Seller with ID ${id} not found`,
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update seller status',
        error: error.message,
      };
    }
  }
}
