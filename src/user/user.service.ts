import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entities';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: mongoose.Model<User>,
    ) { }

    async getAllUser(pageOption: {
        page?: number,
        show?: number,
        search?: string,
      }, authorization: string): Promise<{ data: User[], count: number }> {
        
        const limit = pageOption?.show;
        const skip = (pageOption?.page - 1) * pageOption?.show;
        const sortOptions: any = {};
        sortOptions.updatedAt = -1;
      
        // Tạo một đối tượng truy vấn MongoDB
        const query: any = {};
      
        if (pageOption.search) {
          // Sử dụng biểu thức chính quy để tìm kiếm tên người dùng, tên đầy đủ và liên hệ không phân biệt hoa thường
          const searchRegex = new RegExp(pageOption.search, 'i');
          query.$or = [
            { username: searchRegex },
            { fullname: searchRegex },
            { contact: searchRegex },
          ];
        }
      
        const users = await this.userModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort(sortOptions)
          .exec();
      
        if (!users || users.length === 0) {
          throw new NotFoundException('No users found in the requested page.');
        }
      
        // Đếm tổng số lượng người dùng phù hợp với truy vấn
        const totalCount = await this.userModel.countDocuments(query);
      
        return {
          data: users,
          count: totalCount,
        };
      }      

    async findOne(username: string): Promise<any> {
        const res = await this.userModel.findOne({
            username: username
        });
        return res;
    }

    async getUser(id: string): Promise<User> {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new NotFoundException('user not found.');
        }
        return user;
    }

    async getSearchUsers(content: string): Promise<User[]> {
        let query: any = {}; // Điều kiện truy vấn

        if (content) {
            query.username = { $regex: content, $options: 'i' }; // i: không phân biệt chữ hoa/thường
        }

        const users = await this.userModel
            .find(query)
            .exec();
        if (!users) {
            throw new NotFoundException('user not found.');
        }
        return users;
    }

    async getUserComment(id: string): Promise<{ fullname: string; id: string; username: string }> {
        const user = await this.userModel.findById(id, 'fullname avatar _id username').exec();
        
        if (!user) {
            throw new NotFoundException('User not found.');
        }

        return {
            fullname: user.fullName,
            id: user._id.toString(),
            username: user.username, 
        };
    }

    async createUser(user: CreateUserDto): Promise<any> {
        const hash: any = await bcrypt.hash(
            user.password,
            10,
        );
        user.password = hash;
        const res = this.userModel.create(user);

        return res;
    }

    async updateUser(id: string, user: UpdateUserDto): Promise<User> {
        const res = await this.userModel.findByIdAndUpdate(id, user, {
            new: true,
            runValidators: true,
        });
        return res;
    }
    
    async deleteUser(id: string) {
        const res = await this.userModel.findByIdAndDelete(id);
        return res;
    }
}