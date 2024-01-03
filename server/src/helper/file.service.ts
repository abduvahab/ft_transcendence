import { BadRequestException, Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as path from 'path';


@Injectable()
export class FileService{
    storeFile(file:Express.Multer.File,nameFile:string):string{
        const dir = './upload'
        if(!fs.existsSync(dir))
            fs.mkdirSync(dir)
        const orignal:string = file.originalname;
        let dot =orignal.split(".")
        if (dot.length != 2)
            throw new BadRequestException('no extention with filename or wrrong name')
        const files:string[] = ["jpg",'png',"svg","jpeg"]
        if(files.indexOf(dot[1]) === -1){
            throw new BadRequestException('you can upload jpg,png,svg or jpeg files')
        }
        const lastName:string = nameFile+"_"+orignal;
        const filePath = path.join(dir,lastName);
        fs.writeFileSync(filePath,file.buffer)
        return lastName
    }
}