import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from '../models/blog.schema';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async getUserBlogs(user: any) {
    return this.blogModel
      .find({ author: user._id })
      .sort({ createdAt: -1 })
      .populate('category', 'name')
      .exec();
  }
}
