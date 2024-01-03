import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { GameService } from "./game.service";
import { JwtAuthGuard } from "src/auth/guards/jwt_auth.guard";



@Controller('game')
export class GameController {
  constructor(
              private readonly gameService: GameService,
            ) {}


@Get()
@UseGuards(JwtAuthGuard)          
async getAllHistories(@Req() req:any){
    return await this.gameService.getAllHistories(+req.user.id)
}

}