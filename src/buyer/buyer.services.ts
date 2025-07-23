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
    follow(userId: string) {
        return { message: `Followed user with ID ${userId}` };
    }
    unfollow(userId: string) {
        return { message: `Unfollowed user with ID ${userId}` };
    }
}