import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JokesController } from './jokes/jokes.controller';

@Module({
  imports: [],
  controllers: [AppController, JokesController],
  providers: [AppService],
})
export class AppModule {}
