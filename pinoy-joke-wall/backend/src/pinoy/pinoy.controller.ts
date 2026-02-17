import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../supabase.service';

@Controller('pinoy_jokes')
export class PinoyController {
  constructor(private readonly supabase: SupabaseService) {}

  @Get('random')
  async getRandomJoke() {
    return this.supabase.getRandomPinoyJoke();
  }
}
