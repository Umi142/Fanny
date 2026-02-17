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
}
