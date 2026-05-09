import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Startup, mockStartups } from '../data/mockData';
import { fetchStartupsFromSupabase, supabase } from '../data/supabaseService';

interface StartupsContextType {
  startups: Startup[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const StartupsContext = createContext<StartupsContextType>({
  startups: [],
  isLoading: true,
  error: null,
  refetch: async () => {},
});

export function StartupsProvider({ children }: { children: ReactNode }) {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const cached = localStorage.getItem('@sanfranilab:startups');
    if (cached) {
      try {
        setStartups(JSON.parse(cached));
        setIsLoading(false);
      } catch (e) {
        // ignore parse error
      }
    } else {
      setIsLoading(true);
    }
    
    setError(null);
    try {
      if (supabase) {
        // Fonte única de verdade: Supabase
        const data = await fetchStartupsFromSupabase();
        if (data.length === 0) {
          // Se o banco estiver vazio, usa os dados de exemplo para mostrar o design
          setStartups(mockStartups);
        } else {
          setStartups(data);
          localStorage.setItem('@sanfranilab:startups', JSON.stringify(data));
        }
      } else {
        // Fallback de desenvolvimento
        setStartups(mockStartups);
      }
    } catch (err) {
      console.error('[StartupsProvider] Erro ao carregar:', err);
      setError('Não foi possível carregar os dados. Exibindo dados de exemplo.');
      if (!cached) setStartups(mockStartups);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <StartupsContext.Provider value={{ startups, isLoading, error, refetch: loadData }}>
      {children}
    </StartupsContext.Provider>
  );
}

export const useStartups = () => useContext(StartupsContext);
