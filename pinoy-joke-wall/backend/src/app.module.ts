import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JokesController } from './jokes/jokes.controller';
import { SupabaseService } from './supabase.service';

@Module({
  imports: [],
  controllers: [AppController, JokesController],
  providers: [AppService, SupabaseService],
})
export class AppModule {}
