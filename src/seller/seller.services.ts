import { Injectable } from "@nestjs/common";

@Injectable()
export class SellerService {
    getSellerInfo() {
        return { message: "Seller information" };
    }
    getSellerById(id: number){
        return { messege: "Seller found by id" };
    }
    createSeller() {
        return { message: "Seller created successfully" };
    }
    updateSeller(id: number, name: string) {
        return { messege: "Seller updated"}
    }
    deleteSeller() {
        return { message: "Seller deleted successfully" };
    }
}