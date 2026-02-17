import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Controller('jokes')
export class JokesController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get()
  async getJokes() {
    return this.supabase.getJokes();
  }
}
