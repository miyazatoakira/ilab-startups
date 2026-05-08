import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { PixelTrail } from '../components/PixelTrail';
import { GooeyFilter } from '../components/GooeyFilter';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Falha ao autenticar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] flex items-center justify-center bg-[#FFFDF2] relative overflow-hidden px-4">
      <GooeyFilter id="login-goo" strength={10} />
      
      {/* Background Decorativo */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" style={{ filter: "url(#login-goo)" }}>
        <PixelTrail pixelSize={32} fadeDuration={1500} pixelClassName="bg-fox/10 rounded-full" className="opacity-40" />
        <div className="absolute -left-20 top-1/4 w-96 h-96 bg-fox/5 blur-3xl rounded-full" />
        <div className="absolute -right-20 bottom-1/4 w-[500px] h-[500px] bg-gold/5 blur-3xl rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2rem] shadow-[0_24px_64px_rgba(42,22,23,0.06)] border border-white/60">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-playfair text-navy mb-2">Acesso Restrito</h1>
            <p className="text-sm font-medium text-brown/50">Entre com as credenciais da sua startup ou perfil administrativo.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, mb: 0 }}
                animate={{ opacity: 1, height: 'auto', mb: 24 }}
                exit={{ opacity: 0, height: 0, mb: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold flex items-start gap-3 border border-red-100 overflow-hidden"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-brown/50 ml-1">E-mail corporativo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brown/40">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-navy font-medium outline-none focus:bg-white focus:ring-2 focus:ring-fox/20 focus:border-fox transition-all"
                  placeholder="admin@foxlaw.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-brown/50 ml-1">Senha de acesso</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-brown/40">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl text-navy font-medium outline-none focus:bg-white focus:ring-2 focus:ring-fox/20 focus:border-fox transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-2 bg-navy text-white hover:bg-navy/90 active:scale-[0.98] focus:ring-4 focus:ring-navy/20 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:scale-100 group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Entrar no Portal
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs font-medium text-brown/40">Problemas para acessar? Contate o Sanfran iLab.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
