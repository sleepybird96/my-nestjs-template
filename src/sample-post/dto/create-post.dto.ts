import { SamplePost } from '../../entities/sample-post.entity';
import { PickType } from '@nestjs/mapped-types';

export class CreatePostDto extends PickType(SamplePost, ['title', 'content']) {
  constructor(title: string, content: string) {
    super();
    this.title = title;
    this.content = content;
  }
}
