import { IsEmail, IsNotEmpty } from "class-validator";

export class RoleCreateDto{
    @IsNotEmpty()
    name: string;
}