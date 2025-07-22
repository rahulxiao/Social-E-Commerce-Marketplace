import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminService {
    getAdminInfo() {
        return { message: "Admin information" };
    }
    createAdmin() {
        return { message: "Admin created successfully" };
    }
    deleteAdmin() {
        return { message: "Admin deleted successfully" };
    }
    getAdminByNameAndId(name: string, id: number) {
        return { message: `Admin info for ${name} with ID ${id}` };
    }
    addAdminBody(name: string, id: number) {
        return { message: `Admin body added for ${name} with ID ${id}` };
    }
    deleteAdminById(id: string) {
        return { message: `Admin with ID ${id} deleted successfully` };
    }
}