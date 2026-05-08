import { useState, useEffect, useCallback } from 'react';
import { Startup, mockStartups } from '../data/mockData';
import { fetchStartupsFromSupabase, supabase } from '../data/supabaseService';

export function useStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (supabase) {
        // Fonte única de verdade: Supabase
        const data = await fetchStartupsFromSupabase();
        setStartups(data);
      } else {
        // Fallback de desenvolvimento (sem variáveis de ambiente configuradas)
        setStartups(mockStartups);
      }
    } catch (err) {
      console.error('[useStartups] Erro ao carregar:', err);
      setError('Não foi possível carregar os dados. Exibindo dados de exemplo.');
      setStartups(mockStartups);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { startups, isLoading, error, refetch: loadData };
}
