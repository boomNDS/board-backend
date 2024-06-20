import { ApiProperty } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    enum: $Enums.PostCommunity,
  })
  @IsNotEmpty()
  @IsEnum($Enums.PostCommunity)
  community: $Enums.PostCommunity;
}
