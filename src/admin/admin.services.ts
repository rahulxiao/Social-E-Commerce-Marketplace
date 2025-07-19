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
}