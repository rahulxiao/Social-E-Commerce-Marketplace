import { Injectable } from "@nestjs/common";

@Injectable()
export class BuyerService {
    getBuyerInfo() {
        return { message: "Buyer information" };
    }
    createBuyer() {
        return { message: "Buyer created successfully" };
    }
    deleteBuyer() {
        return { message: "Buyer deleted successfully" };
    }
    createPost() {
        return { message: 'Post created successfully' };
    }
    getPosts() {
        return { message: 'List of posts' };
    }
    deletePost(postId: string) {
        return { message: `Post with ID ${postId} deleted successfully` };
    }
    likePost(postId: string) {
        return { message: `Liked post with ID ${postId}` };
    }
    unlikePost(postId: string) {
        return { message: `Unliked post with ID ${postId}` };
    }
    follow(buyerId: string) {
        return { message: `Followed buyer with ID ${buyerId}` };
    }
    unfollow(buyerId: string) {
        return { message: `Unfollowed buyer with ID ${buyerId}` };
    }
}