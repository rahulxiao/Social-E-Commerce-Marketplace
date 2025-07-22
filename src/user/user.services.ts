import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    getUserInfo() {
        return { message: "User information" };
    }
    createUser() {
        return { message: "User created successfully" };
    }
    deleteUser() {
        return { message: "User deleted successfully" };
    }
}