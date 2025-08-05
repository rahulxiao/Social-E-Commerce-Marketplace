import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Equal } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { CreateAdminDto, UpdateAdminDto, UpdateCountryDto } from './admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  // Create a user
  async createAdmin(adminData: CreateAdminDto) {
    try {
      // Convert dateOfBirth string to Date if provided
      const processedData = {
        ...adminData,
        dateOfBirth: adminData.dateOfBirth
          ? new Date(adminData.dateOfBirth)
          : undefined,
      };

      const admin = this.adminRepository.create(processedData);
      const savedAdmin = await this.adminRepository.save(admin);
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
      const admins = await this.adminRepository.find({
        where: { joiningDate: Equal(joiningDate) }
      });
      
      return {
        success: true,
        message: 'Admins retrieved by joining date successfully',
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
      const processedData = {
        ...updateData,
        dateOfBirth: updateData.dateOfBirth
          ? new Date(updateData.dateOfBirth)
          : undefined,
      };

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
