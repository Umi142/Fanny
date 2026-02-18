import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import serverlessExpress from '@vendia/serverless-express';
import express from 'express';

let cachedServer: any;

export const handler = async (event: any, context: any, callback: any) => {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    
    nestApp.enableCors();
    await nestApp.init();
    
    cachedServer = serverlessExpress({ app: expressApp });
  }
  
  return cachedServer(event, context, callback);
};