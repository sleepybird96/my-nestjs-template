import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SamplePostService } from './sample-post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class SamplePostController {
  constructor(private readonly samplePostService: SamplePostService) {}

  @Get()
  async getPosts() {
    return this.samplePostService.getPosts();
  }

  @Get(':id')
  async getPost(@Param('id') id: number) {
    return this.samplePostService.getPost(id);
  }

  @Post()
  async createPost(@Body() body: CreatePostDto) {
    return this.samplePostService.createPost(body);
  }

  @Patch(':id')
  async updatePost(@Param('id') id: number, @Body() body: UpdatePostDto) {
    return this.samplePostService.updatePost(id, body);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: number) {
    return this.samplePostService.deletePost(id);
  }
}
