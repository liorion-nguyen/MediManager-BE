import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as mongoose from 'mongoose';
import { BoxChatService } from "src/box-chat/box-chat.service";
import { InjectModel } from "@nestjs/mongoose";
import { Message } from "./schema/message.schema";

@Injectable()
export class MessageService {
    constructor(
        private readonly userService: UserService,
        private readonly boxChatService: BoxChatService,
        @InjectModel(Message.name) private messageModel: mongoose.Model<Message>,
    ) { }

    async getChat(boxId: string) {
        return this.messageModel.find({
            boxId: boxId
        });
    }

    async createMessage(content: any): Promise<any> {
        try {
            await this.userService.getUserById(content.id);
            const boxId = content.boxId;

            return this.messageModel.create({
                userId: content.id,
                boxId: boxId,
                emoji: content.emoji || [],
                reply: content.reply || null,
                content: content.content
            });
        } catch (error) {
            throw new BadRequestException(`User with id ${content.id} not found`);
        }
    }

    async sendChatAi(content: any): Promise<any> {
        const dataFetch = {
            contents: content.content
        }


        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.API_KEY_GG}`;
        const headers = {
            "Content-Type": "application/json"
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(dataFetch)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            let message = "";
            message += data.candidates[0].content.parts[0].text;
            // data.forEach((mess: any) => {
            // });
            // return message;

            message = message.replace(/gemini/gi, "LiorionAi");
            message = message.replace(/google/gi, "Liorion Nguyen");
            try {
                let boxId = content.boxId;
                let boxChat;
                if (!boxId) {
                    const id = content.id;

                    const user = await this.userService.getUserById(id);
                    boxChat = await this.boxChatService.createBoxChat({
                        userId: [
                            id,
                            '66cfd416b79c190c7e9a7f1f'
                        ]
                    });
                    boxId = boxChat._id;
                }

                await this.messageModel.create({
                    userId: content.id,
                    boxId: boxId,
                    reply: content.reply || null,
                    content: content.content[content.content.length - 1].parts[0].text
                });

                const saveMessage = await this.messageModel.create({
                    userId: '66cfd416b79c190c7e9a7f1f',
                    boxId: boxId,
                    reply: content.reply || null,
                    content: message
                });
                return {
                    boxId: boxId,
                    id: saveMessage.id,
                    content: message,
                    // createAt: saveMessage.createdAt,
                    emoji: []
                };
            } catch (error) {
                throw new BadRequestException(`User with id ${content.id} not found`);
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async deleteBox(boxId: string): Promise<any> {
        try {
            await this.messageModel.deleteMany({ boxId: boxId });
            await this.boxChatService.deleteOne(boxId);
            return `Delete box chat ID: ${boxId} success`;
        } catch (error) {
            console.error('Lỗi khi xoá box:', error);
            throw error;
        }
    }

    async updateMessage(id: string, message: any): Promise<any> {
        try {
            await this.messageModel.findByIdAndUpdate(id, message, {
                new: true,
                runValidators: true,
            });
            return message;
        } catch (error) {
            console.error('Lỗi khi xoá message:', error);
            throw error;
        }
    }
}
