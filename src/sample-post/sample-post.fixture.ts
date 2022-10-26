import { SamplePost } from '../entities/sample-post.entity';

export const testTitle = 'some title';
export const testContent = 'some content';
export const post = new SamplePost(testTitle, testContent);
export const posts = [
  new SamplePost(testTitle + '1', testContent),
  new SamplePost(testTitle + '2', testContent),
  new SamplePost(testTitle + '3', testContent),
  new SamplePost(testTitle + '4', testContent),
];
