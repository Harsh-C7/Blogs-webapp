import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BlogService } from './blog.service';
import { Request } from 'express';

@Controller('api/blogs')
@UseGuards(AuthGuard('jwt'))
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Get()

  async getBlogs(@Req() req: Request & { user: any }) {
    const user = req.user;
    return this.blogService.getUserBlogs(user);
  }
}
