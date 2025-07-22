import { Injectable } from "@nestjs/common";

@Injectable()
export class SellerService {
    getSellerInfo() {
        return { message: "Seller information" };
    }

    createSeller() {
        return { message: "Seller created successfully" };
    }
    deleteSeller() {
        return { message: "Seller deleted successfully" };
    }
}