import { Link, Outlet, useLocation } from "react-router-dom";
import { LogIn, LogOut, Instagram, Linkedin, Mail, Menu, X, Bell } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "motion/react";

/* ─── Grain overlay — fixo, nunca em scroll containers ──────── */
// Conforme skill high-end-visual-design §6 e design-taste-frontend §5
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E")`;

export default function RootLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => location.pathname === href;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Ranking", href: "/#ranking" },
    { label: "Startups", href: "/#startups" },
    { label: "Patrocínio", href: "/#patrocinadores" },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── P3: Grain overlay fixo — pointer-events-none, z-toast ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: GRAIN_SVG,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
          opacity: 0.22,
          zIndex: "var(--z-toast)",
          mixBlendMode: "multiply",
        }}
      />

      {/* ── P2: Floating Pill Nav — "Fluid Island" pattern ─────── */}
      <header
        className="sticky top-0 w-full px-4 pt-3 pb-2"
        style={{ zIndex: "var(--z-sticky)" }}
      >
        {/* ─ Pill container */}
        <div
          className={cn(
            "max-w-5xl mx-auto flex items-center justify-between px-5 sm:px-6 h-14 rounded-full transition-all",
            "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            isScrolled
              ? "bg-brown/96 backdrop-blur-lg shadow-[0_8px_32px_rgba(42,22,23,0.4)] border border-white/10"
              : "bg-brown/90 backdrop-blur-md shadow-[0_4px_20px_rgba(42,22,23,0.25)] border border-white/8"
          )}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-2.5 shrink-0"
            aria-label="Sanfran iLab — Página inicial"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center overflow-hidden">
              <img
                src="/logo.png"
                alt="Sanfran iLab Logo"
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-playfair text-base sm:text-lg font-black tracking-tighter text-fox leading-none">
                SANFRAN
              </span>
              <span className="font-playfair text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-gold leading-none mt-0.5">
                ILAB
              </span>
            </div>
          </Link>

          {/* Nav Desktop */}
          <nav
            className="hidden md:flex items-center gap-5 text-[13px] font-medium"
            aria-label="Navegação principal"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "relative transition-colors duration-200 py-1",
                  isActive(link.href)
                    ? "text-fox"
                    : "text-cream/75 hover:text-fox"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-fox rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-white text-xs font-bold leading-tight">
                    {user.name}
                  </span>
                  <span className="text-white/45 text-[9px] uppercase font-bold tracking-widest">
                    {user.role === "admin" ? "Administrador" : "Founder"}
                  </span>
                </div>

                {/* Botão Admin */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="relative flex items-center gap-1.5 text-xs font-black border border-gold/70 text-gold px-3.5 py-1.5 rounded-full hover:bg-gold/10 active:scale-95 transition-all uppercase tracking-widest"
                    style={{ transition: "all 0.2s cubic-bezier(0.32,0.72,0,1)" }}
                    aria-label="Painel de Aprovações"
                  >
                    <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-xs font-bold border border-fox/70 text-fox px-3.5 py-1.5 rounded-full hover:bg-fox/10 active:scale-95 transition-all"
                  style={{ transition: "all 0.2s cubic-bezier(0.32,0.72,0,1)" }}
                  aria-label="Sair da conta"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 text-[11px] font-black border border-white/20 px-3.5 sm:px-4 py-1.5 rounded-full hover:bg-white/10 active:scale-95 uppercase tracking-widest text-cream/90"
                style={{ transition: "all 0.2s cubic-bezier(0.32,0.72,0,1)" }}
                aria-label="Acesso restrito — fazer login"
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Acesso Restrito</span>
                <span className="sm:hidden">Entrar</span>
              </Link>
            )}

            {/* Hamburger */}
            <button
              className="flex md:hidden items-center justify-center w-8 h-8 rounded-full border border-white/20 text-cream hover:bg-white/10 active:scale-95"
              style={{ transition: "all 0.2s cubic-bezier(0.32,0.72,0,1)" }}
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28, duration: 0.2 }}
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28, duration: 0.2 }}
                  >
                    <Menu className="w-4 h-4" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── P4: Mobile dropdown — translateY, sem height animation ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="max-w-5xl mx-auto mt-2 rounded-2xl bg-brown/96 backdrop-blur-xl border border-white/10 overflow-hidden shadow-[0_16px_48px_rgba(42,22,23,0.4)] md:hidden"
            >
              <nav
                className="px-3 py-3 flex flex-col gap-1"
                aria-label="Menu mobile"
              >
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 340,
                      damping: 26,
                      delay: i * 0.05,
                    }}
                    className={cn(
                      "px-4 py-3 rounded-xl font-bold text-sm",
                      "transition-colors duration-150",
                      isActive(link.href)
                        ? "text-fox bg-fox/10"
                        : "text-cream/75 hover:text-fox hover:bg-white/5"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 flex flex-col" id="main-content">
        <Outlet />
      </main>

      <footer className="bg-brown text-white py-16 mt-auto border-t-[5px] border-fox">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">

            {/* Coluna 1 — Brand */}
            <div className="flex flex-col gap-6">
              <Link to="/" className="flex items-center gap-3 w-fit" aria-label="Sanfran iLab">
                <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="Sanfran iLab Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col leading-[1.1]">
                  <span className="font-playfair text-lg font-black tracking-tight text-fox uppercase">Sanfran</span>
                  <span className="font-playfair text-xs font-bold tracking-widest text-gold uppercase">Ilab</span>
                </div>
              </Link>
              <p className="text-white/55 text-sm leading-relaxed max-w-xs">
                O Hub de Inovação Jurídica da Sanfran. Elite tecnológica e epicentro do ecossistema de startups de direito.
              </p>
              <a
                href="mailto:contato@sanfranilab.com.br"
                className="flex items-center gap-3 text-white/55 group hover:text-white w-fit"
                style={{ transition: "color 0.2s cubic-bezier(0.32,0.72,0,1)" }}
                aria-label="Enviar e-mail para contato@sanfranilab.com.br"
              >
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-gold/10 transition-colors duration-200">
                  <Mail className="w-4 h-4 text-gold" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium">contato@sanfranilab.com.br</span>
              </a>
            </div>

            {/* Coluna 2 — Social */}
            <div className="flex flex-col gap-5">
              <h4 className="font-playfair font-black text-lg italic text-gold uppercase tracking-tighter">
                Siga-nos
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  { href: "https://www.instagram.com/sanfran.ilab/", label: "Instagram", Icon: Instagram },
                  { href: "https://www.linkedin.com/company/sanfran-inovalab/", label: "LinkedIn", Icon: Linkedin },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-white/55 hover:text-fox group"
                    style={{ transition: "color 0.2s cubic-bezier(0.32,0.72,0,1)" }}
                    aria-label={`${label} do Sanfran iLab (abre em nova aba)`}
                  >
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-fox/20 transition-colors duration-200">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="text-sm font-bold tracking-tight uppercase">{label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* L4: Coluna 3 — Links Rápidos (mais útil que tagline vazia) */}
            <div className="flex flex-col gap-5 lg:items-end">
              <h4 className="font-playfair font-black text-lg italic text-gold uppercase tracking-tighter">
                Navegação
              </h4>
              <div className="flex flex-col gap-2 lg:items-end">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-white/45 hover:text-fox font-medium"
                    style={{ transition: "color 0.2s cubic-bezier(0.32,0.72,0,1)" }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <p className="text-white/30 text-[11px] leading-relaxed max-w-[200px] lg:text-right mt-2">
                Fomentando a próxima geração de legaltechs via mentoria e networking.
              </p>
            </div>

          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-white/25 uppercase">
            <span>&copy; {new Date().getFullYear()} Sanfran iLab. Todos os direitos reservados.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-gold transition-colors" aria-label="Política de Privacidade">Privacidade</a>
              <a href="#" className="hover:text-gold transition-colors" aria-label="Termos de Uso">Termos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
