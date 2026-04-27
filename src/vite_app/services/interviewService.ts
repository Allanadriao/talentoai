import { supabase } from '../lib/supabase';
import { Interview } from '../types';

export const interviewService = {
  async fetchInterviews() {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async deleteInterview(id: string) {
    const { error } = await supabase
      .from('interviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
