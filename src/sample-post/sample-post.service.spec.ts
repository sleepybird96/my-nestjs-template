import { Test, TestingModule } from '@nestjs/testing';
import { SamplePostService } from './sample-post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SamplePost } from '../entities/sample-post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { post, posts } from './sample-post.fixture';

describe('SamplePostService', () => {
  let service: SamplePostService;
  let repository: Repository<SamplePost>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SamplePostService,
        {
          provide: getRepositoryToken(SamplePost),
          useValue: {
            find: jest.fn().mockResolvedValue(posts),
            findOne: jest.fn().mockResolvedValue(post),
            create: jest.fn().mockReturnValue(post),
            save: jest.fn().mockResolvedValue(post),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<SamplePostService>(SamplePostService);
    repository = module.get<Repository<SamplePost>>(
      getRepositoryToken(SamplePost),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPosts', () => {
    it('should get many post', async () => {
      const getPostsResult = await service.getPosts();

      expect(getPostsResult).toEqual(posts);
    });
  });

  describe('getPost', () => {
    it('should get one post', async () => {
      const repositorySpy = jest.spyOn(repository, 'findOne');

      const getPostResult = await service.getPost(1);

      expect(getPostResult).toEqual(post);
      expect(repositorySpy).toBeCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('createPost', () => {
    it('should create new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'title',
        content: 'content',
      };

      const createPostResult = await service.createPost(createPostDto);

      expect(jest.spyOn(repository, 'create')).toBeCalledWith(createPostDto);
      expect(jest.spyOn(repository, 'save')).toBeCalledWith(post);
      expect(createPostResult).toEqual(post);
    });
  });

  describe('updatePost', () => {
    it('should update post', async () => {
      const postId = 1;
      const updatePostDto: UpdatePostDto = {
        content: 'updated content',
      };
      const updatedAt = new Date();

      const updatePostResult = await service.updatePost(
        postId,
        updatePostDto,
        updatedAt,
      );

      expect(jest.spyOn(repository, 'create')).toBeCalledWith({
        ...post,
        ...updatePostDto,
        updatedAt,
      });
      expect(jest.spyOn(repository, 'save')).toBeCalledWith(
        repository.create({
          ...post,
          ...updatePostDto,
          updatedAt,
        }),
      );
      expect(updatePostResult).toEqual(post);
    });
  });

  describe('delete post', () => {
    it('should delete post', async () => {
      const postId = 1;

      await service.deletePost(postId);

      expect(jest.spyOn(repository, 'delete')).toBeCalledWith({
        id: postId,
      });
    });
  });
});
