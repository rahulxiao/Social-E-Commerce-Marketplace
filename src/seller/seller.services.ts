import * as bcrypt from 'bcryptjs';

import { Injectable,BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
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
  ) { }

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
      if (seller.nidImage) {
        // Replace backslashes with forward slashes
        const normalizedPath = seller.nidImage.replace(/\\/g, '/');

        // Prepend your server base URL
        seller.nidImage = `http://localhost:3333/${normalizedPath}`;
        
      }

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
    // check if email already exists
    const existingEmail = await this.sellerRepository.findOne({ where: { email: dto.email } });
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    // check if NID already exists
    const existingNid = await this.sellerRepository.findOne({ where: { nidNumber: dto.nidNumber } });
    if (existingNid) {
      throw new ConflictException('NID number already in use');
    }

    // hash password
    let hashedPassword: string | undefined = undefined;
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(dto.password, salt);
    }

    // create seller entity
    const seller = this.sellerRepository.create({
      name: dto.name,
      email: dto.email,
      nidNumber: dto.nidNumber,
      nidImage: file?.path || '', // safeguard if no file
      age: dto.age,
      status: dto.status || 'active',
      password: hashedPassword,
    });

    try {
      const savedSeller = await this.sellerRepository.save(seller);
      return {
        success: true,
        message: 'Seller created successfully',
        data: savedSeller,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to create seller');
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

 async updateSeller(id: number, dto: UpdateSellerDto, file?: Express.Multer.File) {
  try {
    const seller = await this.sellerRepository.findOne({ where: { id } });
    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // hash password if provided
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    // update only provided fields
    if (file) {
      dto.nidImage = file.path; // same as createSeller
    }

    Object.assign(seller, dto);

    const updatedSeller = await this.sellerRepository.save(seller);

    return {
      success: true,
      message: 'Seller updated successfully',
      data: updatedSeller,
    };
  } catch (error) {
    throw new BadRequestException(error.message || 'Failed to update seller');
  }
}


  async findByEmail(email: string) {
    try {
      const seller = await this.sellerRepository.findOne({
        where: { email },
      });

      return seller;
    } catch (error) {
      return null;
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
