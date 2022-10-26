import { Module } from '@nestjs/common';
import { SamplePostService } from './sample-post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SamplePost } from '../entities/sample-post.entity';
import { SamplePostController } from './sample-post.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SamplePost])],
  providers: [SamplePostService],
  controllers: [SamplePostController],
})
export class SamplePostModule {}
