import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SupabaseService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );

  async getJokes() {
    const { data, error } = await this.supabase
      .from('jokes')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async addJoke(content: string, author_name: string) {
    const { data, error } = await this.supabase
      .from('jokes')
      .insert([{ content, author_name }])
      .select();
    if (error) throw error;
    return data;
  }

  async likeJoke(jokeId: string) {
    const { error } = await this.supabase.rpc('increment_likes', { joke_id: jokeId });
    if (error) throw error;
    return { success: true };
  }

async getRandomPinoyJoke() {
  const { data, error } = await this.supabase.rpc('random_pinoy_joke');
  if (error) throw error;
  return data && data[0] ? data[0] : { content: 'No Pinoy jokes found!' };
}
}
