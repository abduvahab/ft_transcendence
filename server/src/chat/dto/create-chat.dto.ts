import { IsBoolean, IsNumber, IsOptional, IsString, MinLength, isNumber } from "class-validator";

export class CreatePrivateDto {

  // @IsNumber()
  // member1:number

  @IsNumber()
  member2:number
  
}

export class CreatePublicDto {

  @IsString()
  type: 'public' 

  @IsString()
  @MinLength(2)
  name:string

  // creator:number

}

export class CreateProtectedDto {

  @IsString()
  type:'protected'

  @IsString()
  @MinLength(2)
  name:string

  // @IsNumber()
  // creator:number

  @IsString()
  @MinLength(2)
  password:string

}
export class CreateMemberDto {

  @IsNumber()
  user:number

  @IsNumber()
  chat:number

  @IsBoolean()
  @IsOptional()
  isCreator?: boolean;

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

}
