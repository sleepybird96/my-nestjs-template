import { Test, TestingModule } from '@nestjs/testing';
import { SamplePostController } from './sample-post.controller';
import { SamplePostService } from './sample-post.service';
import { post, posts } from './sample-post.fixture';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('SamplePostController', () => {
  let controller: SamplePostController;
  let service: SamplePostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SamplePostController],
      providers: [
        {
          provide: SamplePostService,
          useValue: {
            getPost: jest.fn().mockResolvedValue(post),
            getPosts: jest.fn().mockResolvedValue(posts),
            createPost: jest.fn().mockReturnValue(post),
            updatePost: jest.fn().mockResolvedValue(post),
            deletePost: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<SamplePostController>(SamplePostController);
    service = module.get<SamplePostService>(SamplePostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPost', () => {
    it('should get post', async () => {
      const postId = 1;

      const getPostResult = await controller.getPost(postId);

      expect(jest.spyOn(service, 'getPost')).toBeCalledWith(postId);
      expect(getPostResult).toEqual(post);
    });
  });

  describe('getPosts', () => {
    it('should get posts', async () => {
      const getPostsResult = await controller.getPosts();

      expect(jest.spyOn(service, 'getPosts')).toBeCalledTimes(1);
      expect(getPostsResult).toEqual(posts);
    });
  });

  describe('createPost', () => {
    it('should create post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'new title',
        content: 'new content',
      };

      const createPostResult = await controller.createPost(createPostDto);

      expect(jest.spyOn(service, 'createPost')).toBeCalledWith(createPostDto);
      expect(createPostResult).toEqual(post);
    });
  });

  describe('updatePost', () => {
    it('should update post', async () => {
      const postId = 1;
      const updatePostDto: UpdatePostDto = {
        title: 'updated title',
      };

      const updatePostResult = await controller.updatePost(
        postId,
        updatePostDto,
      );

      expect(jest.spyOn(service, 'updatePost')).toBeCalledWith(
        postId,
        updatePostDto,
      );
      expect(updatePostResult).toEqual(post);
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      const postId = 1;

      await controller.deletePost(postId);

      expect(jest.spyOn(service, 'deletePost')).toBeCalledWith(postId);
    });
  });
});
