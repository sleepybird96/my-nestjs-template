import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SamplePost } from '../entities/sample-post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class SamplePostService {
  constructor(
    @InjectRepository(SamplePost)
    private readonly postRepository: Repository<SamplePost>,
  ) {}

  async getPost(id: number): Promise<SamplePost> {
    return await this.postRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getPosts(): Promise<SamplePost[]> {
    return await this.postRepository.find();
  }

  async createPost(createPostDto: CreatePostDto): Promise<SamplePost> {
    const createdPost = this.postRepository.create(createPostDto);
    return this.postRepository.save(createdPost);
  }

  async updatePost(
    id: number,
    updatePostDto: UpdatePostDto,
    updatedAt: Date = new Date(),
  ): Promise<SamplePost> {
    const post = await this.postRepository.findOne({
      where: { id },
    });
    return await this.postRepository.save(
      this.postRepository.create({
        ...post,
        ...updatePostDto,
        updatedAt,
      }),
    );
  }

  async deletePost(id: number): Promise<void> {
    await this.postRepository.delete({ id });
  }
}
