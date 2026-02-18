import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

// This will cache the server so it doesn't have to restart on every click
let cachedServer: any;

export default async (req: any, res: any) => {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );
    
    // VERY IMPORTANT: This matches frontend calls like fetch('/api/jokes')
    nestApp.setGlobalPrefix('api'); 
    
    nestApp.enableCors();
    await nestApp.init();
    
    cachedServer = expressApp;
  }
  
  // Directly pass the request to the Express instance
  return cachedServer(req, res);
};