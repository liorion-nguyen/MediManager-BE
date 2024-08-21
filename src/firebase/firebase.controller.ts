import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseService } from './firebase.service';

@Controller('upload')
export class FirebaseController {
  constructor(private readonly firebaseStorageService: FirebaseService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<{ url: string }> {
    const url = await this.firebaseStorageService.uploadImage(file);
    return { url };
  }
}
