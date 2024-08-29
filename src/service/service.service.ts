import { Injectable, NotFoundException, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Service } from './entities/service.entities';
import { CreateServiceDto, UpdateServiceDto } from './dto/service';

@Injectable()
export class ServiceService {
    constructor(
        @InjectModel(Service.name) private ServiceModel: mongoose.Model<Service>,
    ) { }

    async getAllService(pageOption: {
        page?: number,
        show?: number,
        search?: string,
      }, authorization: string): Promise<{ data: Service[], count: number }> {
        
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
            { Servicename: searchRegex },
            { fullname: searchRegex },
            { contact: searchRegex },
          ];
        }
      
        const Services = await this.ServiceModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .sort(sortOptions)
          .exec();
      
        if (!Services || Services.length === 0) {
          throw new NotFoundException('No Services found in the requested page.');
        }
      
        // Đếm tổng số lượng người dùng phù hợp với truy vấn
        const totalCount = await this.ServiceModel.countDocuments(query);
      
        return {
          data: Services,
          count: totalCount,
        };
      }      

    async findOne(Servicename: string): Promise<any> {
        const res = await this.ServiceModel.findOne({
            Servicename: Servicename
        });
        return res;
    }

    async getService(id: string): Promise<Service> {
        const Service = await this.ServiceModel.findById(id);
        if (!Service) {
            throw new NotFoundException('Service not found.');
        }
        return Service;
    }

    async getSearchServices(content: string): Promise<Service[]> {
        let query: any = {}; // Điều kiện truy vấn

        if (content) {
            query.Servicename = { $regex: content, $options: 'i' }; // i: không phân biệt chữ hoa/thường
        }

        const Services = await this.ServiceModel
            .find(query)
            .exec();
        if (!Services) {
            throw new NotFoundException('Service not found.');
        }
        return Services;
    }

    async createService(Service: CreateServiceDto): Promise<any> {
        const res = this.ServiceModel.create(Service);
        return res;
    }

    async updateService(id: string, Service: UpdateServiceDto): Promise<Service> {
        const res = await this.ServiceModel.findByIdAndUpdate(id, Service, {
            new: true,
            runValidators: true,
        });
        return res;
    }
    
    async deleteService(id: string) {
        const res = await this.ServiceModel.findByIdAndDelete(id);
        return res;
    }
}