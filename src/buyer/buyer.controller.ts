import { Controller, Delete, Get, Post, Param } from "@nestjs/common";
import { UserService } from "./buyer.services";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}
    @Get('getUserInfo')
    getUserInfo() {
        return this.userService.getUserInfo();
    }
    @Post('createUser')
    createUser() {
        return this.userService.createUser();
    }
    @Delete('deleteUser')
    deleteUser() {
        return this.userService.createUser(); 
    }

    @Post('createPost')
    createPost() {
        return this.userService.createPost();
    }

    @Get('getPosts')
    getPosts() {
        return this.userService.getPosts();
    }

    @Delete('deletePost/:postId')
    deletePost(@Param('postId') postId: string) {
        return this.userService.deletePost(postId);
    }

    @Post('likePost/:postId')
    likePost(@Param('postId') postId: string) {
        return this.userService.likePost(postId);
    }

    @Post('unlikePost/:postId')
    unlikePost(@Param('postId') postId: string) {
        return this.userService.unlikePost(postId);
    }

    @Post('follow/:userId')
    follow(@Param('userId') userId: string) {
        return this.userService.follow(userId);
    }

    @Post('unfollow/:userId')
    unfollow(@Param('userId') userId: string) {
        return this.userService.unfollow(userId);
    }
}