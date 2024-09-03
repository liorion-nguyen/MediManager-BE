import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { BoxChatService } from "./box-chat.service";

@Controller('BoxChat')
export class BoxChatController {
    constructor(private readonly boxChatService: BoxChatService) { }

    @Get('/user/:id')
    async getBoxChat(@Param('id') id: string): Promise<any> {
        return this.boxChatService.getBoxChat(id);
    }

    @Get('/informationUser/:id')
    async getInformationUser(@Param('id') id: string): Promise<any> {
        return this.boxChatService.getInformationUser(id);
    }

    @Get('/checkBox')
    async getBoxIdWithUser(
        @Query('id1') id1: string,
        @Query('id2') id2: string
    ): Promise<any> {
        return this.boxChatService.getBoxIdWithUser(id1, id2);
    }


    @Post()
    async createBoxChat(@Body() content: any): Promise<any> {
        return this.boxChatService.createBoxChat(content);
    }
}