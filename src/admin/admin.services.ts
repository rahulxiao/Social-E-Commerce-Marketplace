import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdminEntity } from "./admin.entity";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private adminRepository: Repository<AdminEntity>
    ) {}

    async getAdminInfo() {
        try {
            const admins = await this.adminRepository.find();
            return { 
                success: true, 
                message: "Admin information retrieved successfully", 
                data: admins 
            };
        } catch (error) {
            return { 
                success: false, 
                message: "Failed to retrieve admin information", 
                error: error.message 
            };
        }
    }

    async createAdmin(adminData: Partial<AdminEntity>) {
        try {
            const admin = this.adminRepository.create(adminData);
            const savedAdmin = await this.adminRepository.save(admin);
            return { 
                success: true, 
                message: "Admin created successfully", 
                data: savedAdmin 
            };
        } catch (error) {
            return { 
                success: false, 
                message: "Failed to create admin", 
                error: error.message 
            };
        }
    }
    async getAdminByNameAndId(name: string, id: number) {
        try {
            const admin = await this.adminRepository.findOne({ 
                where: { name, id } 
            });
            if (admin) {
                return { 
                    success: true, 
                    message: `Admin info for ${name} with ID ${id}`, 
                    data: admin 
                };
            } else {
                return { 
                    success: false, 
                    message: "Admin not found" 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                message: "Failed to retrieve admin", 
                error: error.message 
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
                data: savedAdmin 
            };
        } catch (error) {
            return { 
                success: false, 
                message: "Failed to add admin", 
                error: error.message 
            };
        }
    }

    async deleteAdminById(id: string) {
        try {
            const result = await this.adminRepository.delete(id);
            if (result.affected && result.affected > 0) {
                return { 
                    success: true, 
                    message: `Admin with ID ${id} deleted successfully` 
                };
            } else {
                return { 
                    success: false, 
                    message: "Admin not found" 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                message: "Failed to delete admin", 
                error: error.message 
            };
        }
    }

    async getAdminById(id: number) {
        try {
            const admin = await this.adminRepository.findOne({ 
                where: { id } 
            });
            if (admin) {
                return { 
                    success: true, 
                    message: "Admin found", 
                    data: admin 
                };
            } else {
                return { 
                    success: false, 
                    message: "Admin not found" 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                message: "Failed to retrieve admin", 
                error: error.message 
            };
        }
    }

    async updateAdmin(id: number, updateData: Partial<AdminEntity>) {
        try {
            const result = await this.adminRepository.update(id, updateData);
            if (result.affected && result.affected > 0) {
                const updatedAdmin = await this.adminRepository.findOne({ 
                    where: { id } 
                });
                return { 
                    success: true, 
                    message: "Admin updated successfully", 
                    data: updatedAdmin 
                };
            } else {
                return { 
                    success: false, 
                    message: "Admin not found" 
                };
            }
        } catch (error) {
            return { 
                success: false, 
                message: "Failed to update admin", 
                error: error.message 
            };
        }
    }
}