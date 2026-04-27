import { supabase } from '../lib/supabase';
import { Candidate } from '../types';

export const candidateService = {
  async fetchCandidates() {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async deleteCandidate(id: string) {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
