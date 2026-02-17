import { Controller, Get, Post, Body } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Controller('jokes')
export class JokesController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get()
  async getJokes() {
    return this.supabase.getJokes();
  }

  @Post()
  async addJoke(@Body() body: { content: string; author_name?: string }) {
    return this.supabase.addJoke(body.content, body.author_name || 'Anonymous');
  }

  @Post('like')
  async likeJoke(@Body() body: { jokeId: string }) {
    return this.supabase.likeJoke(body.jokeId);
  }
}
