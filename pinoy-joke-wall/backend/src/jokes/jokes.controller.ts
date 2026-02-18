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
  async addJoke(
    @Body() body: { content: string; author_name?: string; avatar_url?: string }
  ) {
    // Extract avatar_url from the body and pass it to the service
    return this.supabase.addJoke(
      body.content,
      body.author_name || 'Anonymous',
      body.avatar_url || '/avatars/meme1.jpg' // Default fallback if none sent
    );
  }

  @Post('like')
  async likeJoke(@Body() body: { jokeId: string }) {
    return this.supabase.likeJoke(body.jokeId);
  }

  @Get('random-pinoy')
  async getRandomPinoyJoke() {
    return this.supabase.getRandomPinoyJoke();
  }
}