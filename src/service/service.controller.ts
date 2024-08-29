import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Param,
    Delete,
    Query,
    BadRequestException,
    Headers,
} from '@nestjs/common';
import { Service } from './entities/service.entities';
import { CreateServiceDto, UpdateServiceDto } from './dto/service';
import { ServiceService } from './service.service';


@Controller('services')
export class ServiceController {
    constructor(
        private ServiceService: ServiceService,
    ) { }


    @Get()
    async getAllService(
        @Query() pageOption: {
            page?: number,
            show?: number,
            search?: string,
        },
        @Headers('authorization') authorization: string,
    ): Promise<{ data: Service[], count: number }> {

        if (pageOption.page && pageOption.page < 1) {
            throw new BadRequestException('Invalid page number. Page number must be greater than or equal to 1.');
        }
        return this.ServiceService.getAllService(pageOption, authorization);
    }

    @Get(':id')
    async getService(
        @Param('id') id: string,
    ): Promise<Service> {
        return this.ServiceService.getService(id);
    }
    @Post()
    async createService(@Body() Service: CreateServiceDto): Promise<Service> {
        console.log(Service);
        
        return this.ServiceService.createService(Service);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() Service: UpdateServiceDto): Promise<Service> {
        return this.ServiceService.updateService(id, Service);
    }

    @Delete(':id')
    async deleteService(
        @Param('id')
        id: string,
    ) {
        return this.ServiceService.deleteService(id);
    }
}