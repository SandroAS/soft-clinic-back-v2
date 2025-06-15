import { Body, Controller, Get, Put, Delete, Param, Query, NotFoundException, UseGuards, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserPersonalInformationDto } from './dtos/update-user-personal-information.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserPersonalInformationResponseDto } from './dtos/update-user-personal-information-response.dto';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAllUsers(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @UseInterceptors(FileInterceptor('profile_image', {
    // Limite de tamanho de arquivo (5MB = 5 * 1024 * 1024 bytes)
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Apenas arquivos de imagem (jpg, jpeg, png, gif) são permitidos!'), false);
      }
      cb(null, true);
    },
  }))
  @Put('/personal-information/:uuid')
  @UseGuards(JwtAuthGuard)
  async updateUserPersonalInformations(
    @Param('uuid') uuid: string,
    @Body() body: UpdateUserPersonalInformationDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<UpdateUserPersonalInformationResponseDto> {
    return await this.usersService.updateUserPersonalInformations(uuid, body, file);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
