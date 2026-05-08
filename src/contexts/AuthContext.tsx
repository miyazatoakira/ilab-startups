import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as MockUser } from '../data/mockData';
import { supabase } from '../data/supabaseService';

// Reusing MockUser interface for backwards compatibility with the UI, 
// but we will populate it from Supabase auth and user_roles table.
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'founder' | 'public';
  startupId?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initial session fetch
    const initSession = async () => {
      if (!supabase) {
        setIsLoading(false);
        return; // Fallback se não tiver Supabase configurado
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    };

    initSession();

    // 2. Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const loadUserProfile = async (authUser: any) => {
    try {
      if (!supabase) return;
      
      // Busca a role e a startup do usuário na tabela user_roles
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, startup_id')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Erro ao carregar perfil do usuário", error);
      }

      setUser({
        id: authUser.id,
        name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        email: authUser.email,
        role: data?.role || 'public',
        startupId: data?.startup_id || undefined
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    // ---- MOCK BYPASS PARA TESTES LOCAIS ----
    if (email === 'admin@foxlaw.com' && password === 'admin') {
      setUser({
        id: 'mock-admin',
        name: 'Administrador de Teste',
        email: 'admin@foxlaw.com',
        role: 'admin'
      });
      return;
    }
    
    if (email === 'founder@teste.com' && password === 'founder') {
      setUser({
        id: 'mock-founder',
        name: 'Founder de Teste',
        email: 'founder@teste.com',
        role: 'founder',
        // Vincula a uma startup real do mock (a primeira que aparece, 'LexDraught')
        startupId: '1' 
      });
      return;
    }
    // ----------------------------------------

    if (!supabase) {
      throw new Error("Supabase não está configurado.");
    }
    
    if (!password) {
      throw new Error("Senha obrigatória");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
