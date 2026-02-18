import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

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
      .eq('is_archived', false) // This filters out the archived jokes that was made during testing
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  // UPDATED: Added avatar_url parameter
  async addJoke(content: string, author_name: string, avatar_url: string) {
    const { data, error } = await this.supabase
      .from('jokes')
      .insert([{ 
        content, 
        author_name, 
        avatar_url // This saves the meme path to SQL column
      }])
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
