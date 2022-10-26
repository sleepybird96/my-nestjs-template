import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { SamplePost } from '../src/entities/sample-post.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { testContent, testTitle } from '../src/sample-post/sample-post.fixture';

describe('Post (e2e)', () => {
  let app: INestApplication;
  let postRepository: Repository<SamplePost>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    postRepository = app.get<Repository<SamplePost>>(
      getRepositoryToken(SamplePost),
    );
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  afterEach(async () => {
    await postRepository.clear();
  });

  describe('GET /posts', () => {
    it('should get posts', async () => {
      const [post1, post2] = await postRepository.save([
        new SamplePost(testTitle + '1', testContent),
        new SamplePost(testTitle + '2', testContent),
      ]);

      const result = await request(app.getHttpServer()).get('/posts');

      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ title: post1.title }),
          expect.objectContaining({ title: post2.title }),
        ]),
      );
    });
  });

  describe('GET /posts/:id', () => {
    it('should get post', async () => {
      const post = await postRepository.save(
        new SamplePost(testTitle + '1', testContent),
      );

      const result = await request(app.getHttpServer()).get(
        `/posts/${post.id}`,
      );

      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual(
        expect.objectContaining({
          title: post.title,
          content: post.content,
        }),
      );
    });
  });

  describe('POST /posts', () => {
    it('should creat post', async () => {
      const result = await request(app.getHttpServer())
        .post('/posts')
        .send({ title: testTitle, content: testContent });

      expect(result.statusCode).toEqual(201);
      expect(result.body).toEqual(
        expect.objectContaining({
          title: testTitle,
          content: testContent,
        }),
      );
    });
  });

  describe('PATCH /posts/:id', () => {
    it('should update post', async () => {
      const post = await postRepository.save(
        new SamplePost(testTitle + '1', testContent),
      );
      const updatedTitle = 'updated';

      const result = await request(app.getHttpServer())
        .patch(`/posts/${post.id}`)
        .send({
          title: updatedTitle,
        });

      expect(result.statusCode).toEqual(200);
      expect(result.body).toEqual(
        expect.objectContaining({
          title: updatedTitle,
        }),
      );
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete post', async () => {
      const post = await postRepository.save(
        new SamplePost(testTitle + '1', testContent),
      );

      const result = await request(app.getHttpServer()).delete(
        `/posts/${post.id}`,
      );

      expect(result.statusCode).toEqual(200);
      expect(
        await postRepository.findOne({
          where: {
            id: post.id,
          },
        }),
      ).toBeNull();
    });
  });
});
