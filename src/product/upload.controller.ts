import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { diskStorage } from 'multer';
import { extname } from 'path/posix';

@Controller('')
export class UploadController {
    constructor(private productService: ProductService){}
    
    @Post('upload')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage( {
            destination: 'uploads',
            filename(_, file, callback){
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                return callback(null, `${randomName}${extname(file.originalname)}`);
            }
            
        }),
    }))
    uploadFile(@UploadedFile() file) {
        return {
            url: `http://localhost:3000/api/${file.path}`,
            originalname: file.originalname,
            filename: file.filename,
            url2: `http://localhost:3000/api/uploads/${file.filename}`,
        }
    }

    @Get('uploads/:path')
    async getImage(
        @Param('path') path,
        @Res() res,
    ){
        return res.sendFile(path, { root: './uploads' });
    }

    // seeUploadedFile(
    //     @Param('imgpath') image, 
    //     @Res() res
    // ) {
    //     return res.sendFile(image, { root: './uploads' });
    // }
    
}
