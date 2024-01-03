import { CanActivate, ExecutionContext, Injectable, NotFoundException, Res } from "@nestjs/common";
import { UserService } from "src/user/user.service";





@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
            private readonly userSer:UserService,
           
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const {id, type} = request.params
    let entity;
    switch(type){

        case 'user':
            entity = this.userSer.findById(+id)
            break
        default:
            throw new NotFoundException()

    }

    if (entity)
        return true;
    throw new NotFoundException()
   
  }

 
}