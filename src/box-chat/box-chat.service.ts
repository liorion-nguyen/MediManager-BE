import { BadRequestException, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { BoxChat } from "./schema/box-chat.schema";

@Injectable()
export class BoxChatService {
    constructor(
        private readonly userService: UserService,
        @InjectModel(BoxChat.name) private readonly boxChatModel: Model<BoxChat>
    ) { }

    async getBoxChat(userId: string) {
        try {
            const allBoxChats = await this.boxChatModel.find().exec(); 
            return allBoxChats.filter(boxChat => 
                boxChat.contactUser.some(item => item.userId === userId)
            );
        } catch (error) {
            console.error("Error getting box chat:", error);
            throw new BadRequestException("Failed to get box chat");
        }
    }

    async getInformationUser(id: string) {
        try {
            return await this.userService.getUserById(id); 
        } catch (error) {
            console.error("Error getting user information:", error);
            throw new BadRequestException("Failed to get user information");
        }
    }

    async getBoxIdWithUser(id1: string, id2: string): Promise<any> {
        try {
            const allBoxChats = await this.boxChatModel.find().exec(); 
            for (const boxChat of allBoxChats) {
                const contactUserIds = boxChat.contactUser.map(user => user.userId);
                if (contactUserIds.length === 2 && contactUserIds.includes(id1) && contactUserIds.includes(id2)) {
                    return boxChat;
                }
            }
            return this.createBoxChat({ userId: [id1, id2] });
        } catch (error) {
            console.error("Error finding box chat with users:", error);
            throw new BadRequestException("Failed to find box chat with users");
        }
    }

    async createBoxChat(data: { userId: string[] }): Promise<any> {
        try {
            const { userId: contactUser } = data;
            if (contactUser.length <= 1) {
                throw new BadRequestException("Error creating Box Chat: number of people joining is not sufficient");
            } else {
                let boxName = "";
                let informationUser = [];
                for (const id of contactUser) {
                    const user = await this.userService.getUserById(id); 
                    if (user) {
                        const { fullName } = user;
                        boxName += `${fullName.split(' ').slice(1).join(' ')}, `;
                        informationUser.push({
                            userId: id,
                            nickName: fullName,
                            role: informationUser.length === 0 ? "Creator" : "Member"
                        });
                    } else {
                        console.warn("User with ID", id, "not found while creating box chat");
                    }
                }
                return this.boxChatModel.create({
                    name: boxName,
                    emotional: "👍",
                    theme: "radial-gradient(circle at center 75%, rgb(85, 208, 255) 0%, rgb(117, 151, 215) 33%, rgb(255, 159, 179) 66%, rgb(255, 159, 179) 99%)",
                    contactUser: informationUser
                }); 
            }
        } catch (error) {
            console.error('Error creating Box Chat:', error);
            throw new BadRequestException("Failed to create Box Chat");
        }
    }

    async deleteOne(boxId: string): Promise<any> {
        try {
            await this.boxChatModel.deleteOne({ _id: boxId });
            return true;
        } catch (error) {
            console.error('Lỗi khi xoá boxId:', error);
            throw error;
        }
    }

    async updateBoxChat(id: string, boxChat: any): Promise<any> {
        try {
            await this.boxChatModel.findByIdAndUpdate(id, boxChat, {
                new: true,
                runValidators: true,
            });
            return boxChat;
        } catch (error) {
            console.error('Lỗi khi cập nhật boxChat:', error);
            throw error;
        }
    }
}
