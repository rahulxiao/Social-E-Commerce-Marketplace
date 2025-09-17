import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { CreateAdminDto, UpdateAdminDto, UpdateCountryDto } from './admin.dto';
import { CustomMailerService } from '../mailer/mailer.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly mailerService: CustomMailerService,
  ) {}

  // Create a user
  async createAdmin(adminData: CreateAdminDto) {
    try {
      // Convert dateOfBirth string to Date if provided
      const processedData: Partial<AdminEntity> = {
        ...adminData,
        dateOfBirth: adminData.dateOfBirth
          ? new Date(adminData.dateOfBirth)
          : undefined,
      };

      if (processedData.password) {
        const saltRounds = 10;
        processedData.password = await bcrypt.hash(processedData.password, saltRounds);
      }

      const admin = this.adminRepository.create(processedData as AdminEntity);
      const savedAdmin = await this.adminRepository.save(admin);

      // Send welcome email
      await this.mailerService.sendWelcomeEmail(
        savedAdmin.email,
        savedAdmin.name
      );

      return {
        success: true,
        message: 'Admin created successfully',
        data: savedAdmin,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create admin',
        error: error.message,
      };
    }
  }


 

  // Modify the country of an existing user
  async updateCountry(id: number, updateCountryDto: UpdateCountryDto) {
    try {
      const admin = await this.adminRepository.findOne({ where: { id } });
      if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
      }

      admin.country = updateCountryDto.country;
      const updatedAdmin = await this.adminRepository.save(admin);
      
      return {
        success: true,
        message: 'Country updated successfully',
        data: updatedAdmin,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update country',
        error: error.message,
      };
    }
  }

  // Retrieve users by their joining date
  async getAdminsByJoiningDate(joiningDate: Date) {
    try {
      // Create start and end of the day for the given date
      const startOfDay = new Date(joiningDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(joiningDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      const admins = await this.adminRepository.find({
        where: { 
          joiningDate: Between(startOfDay, endOfDay)
        }
      });
      
      return {
        success: true,
        message: `Admins retrieved by joining date ${joiningDate.toDateString()} successfully`,
        count: admins.length,
        data: admins,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve admins by joining date',
        error: error.message,
      };
    }
  }

  // Retrieve users with the default country value ('Unknown')
  async getAdminsWithDefaultCountry() {
    try {
      const admins = await this.adminRepository.find({
        where: { country: 'Unknown' }
      });
      
      return {
        success: true,
        message: 'Admins with default country retrieved successfully',
        count: admins.length,
        data: admins,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve admins with default country',
        error: error.message,
      };
    }
  }

  // Find admin by username for authentication
  async findByUsername(username: string) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { username }
      });
      
      return admin;
    } catch (error) {
      return null;
    }
  }

  // Find admin by email for authentication
  async findByEmail(email: string) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { email }
      });
      
      return admin;
    } catch (error) {
      return null;
    }
  }

  // Additional methods for general operations
  async getAllAdmins() {
    try {
      const admins = await this.adminRepository.find();
      return {
        success: true,
        message: 'All admins retrieved successfully',
        count: admins.length,
        data: admins,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve all admins',
        error: error.message,
      };
    }
  }

  // Legacy methods for compatibility
  async getAdminInfo() {
    try {
      const admins = await this.adminRepository.find();
      return {
        success: true,
        message: 'Admin information retrieved successfully',
        data: admins,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve admin information',
        error: error.message,
      };
    }
  }

  async getAdminByNameAndId(name: string, id: number) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { name, id },
      });
      if (admin) {
        return {
          success: true,
          message: `Admin info for ${name} with ID ${id}`,
          data: admin,
        };
      } else {
        return {
          success: false,
          message: 'Admin not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve admin',
        error: error.message,
      };
    }
  }

  async addAdminBody(name: string, id: number) {
    try {
      const adminData = { name, id } as Partial<AdminEntity>;
      const admin = this.adminRepository.create(adminData);
      const savedAdmin = await this.adminRepository.save(admin);
      return {
        success: true,
        message: `Admin body added for ${name} with ID ${id}`,
        data: savedAdmin,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add admin',
        error: error.message,
      };
    }
  }

  async deleteAdminById(id: string) {
    try {
      const result = await this.adminRepository.delete(id);
      if (result.affected && result.affected > 0) {
        return {
          success: true,
          message: `Admin with ID ${id} deleted successfully`,
        };
      } else {
        return {
          success: false,
          message: 'Admin not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete admin',
        error: error.message,
      };
    }
  }

  async getAdminById(id: number) {
    try {
      const admin = await this.adminRepository.findOne({
        where: { id },
      });
      if (admin) {
        return {
          success: true,
          message: 'Admin found',
          data: admin,
        };
      } else {
        return {
          success: false,
          message: 'Admin not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve admin',
        error: error.message,
      };
    }
  }

  async updateAdmin(id: number, updateData: UpdateAdminDto) {
    try {
      // Convert dateOfBirth string to Date if provided
      const processedData: Partial<AdminEntity> = {
        ...updateData,
        dateOfBirth: updateData.dateOfBirth
          ? new Date(updateData.dateOfBirth)
          : undefined,
      };

      if (processedData.password) {
        const saltRounds = 10;
        processedData.password = await bcrypt.hash(processedData.password, saltRounds);
      }

      const result = await this.adminRepository.update(id, processedData);
      if (result.affected && result.affected > 0) {
        const updatedAdmin = await this.adminRepository.findOne({
          where: { id },
        });
        return {
          success: true,
          message: 'Admin updated successfully',
          data: updatedAdmin,
        };
      } else {
        return {
          success: false,
          message: 'Admin not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update admin',
        error: error.message,
      };
    }
  }
}