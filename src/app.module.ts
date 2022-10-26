import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SamplePost } from './entities/sample-post.entity';
import { SamplePostModule } from './sample-post/sample-post.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: process.env.APPLICATION_ENV !== 'test',
      validationSchema: Joi.object({
        APPLICATION_ENV: Joi.string()
          .valid('dev', 'prod', 'test')
          .default('test'),
        PORT: Joi.number().default(3000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [SamplePost],
        synchronize: false,
        logging: configService.get<string>('APPLICATION_ENV') !== 'prod',
      }),
    }),
    SamplePostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
