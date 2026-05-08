import { ArrowRight, Star, Target, Building2, Send, Sparkles, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { useStartups } from "../hooks/useStartups";
import { motion } from "motion/react";
import StartupIcon from "../components/StartupIcon";
import { GooeyFilter } from "../components/GooeyFilter";
import { PixelTrail } from "../components/PixelTrail";
import React, { useState } from "react";

/* ─── Animation Variants ─────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

/* ─── Skeleton Components ─────────────────────────────────── */
function RankingSkeleton() {
  return (
    <div className="divide-y divide-brown/5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center p-6 gap-4">
          <div className="skeleton w-8 h-8 rounded-lg" />
          <div className="skeleton w-10 h-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-40 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
          <div className="skeleton h-8 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}

function CardsSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-[240px] sm:h-[280px] rounded-2xl overflow-hidden skeleton"
        />
      ))}
    </>
  );
}

/* ─── Sponsor Form ────────────────────────────────────────── */
function SponsorForm() {
  const [fields, setFields] = useState({
    empresa: "",
    contato: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fields.empresa.trim())
      newErrors.empresa = "Nome da empresa é obrigatório.";
    if (!fields.contato.trim()) newErrors.contato = "Nome do contato é obrigatório.";
    if (!fields.email.trim()) {
      newErrors.email = "E-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      newErrors.email = "Digite um e-mail válido.";
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((err) => ({ ...err, [field]: "" }));
    };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-12 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-teal" />
        </div>
        <h4 className="font-playfair font-bold text-2xl text-brown">
          Recebemos seu contato!
        </h4>
        <p className="text-brown/60 text-sm max-w-xs">
          Nossa equipe entrará em contato em breve para apresentar as cotas de
          patrocínio disponíveis.
        </p>
      </motion.div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label
            htmlFor="empresa"
            className="text-sm font-bold text-brown/70 block"
          >
            Nome da Empresa
          </label>
          <input
            id="empresa"
            type="text"
            value={fields.empresa}
            onChange={handleChange("empresa")}
            className={cn(
              "w-full bg-[#F9F9F9] border rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-fox/20 transition-all text-brown",
              errors.empresa
                ? "border-red-400 bg-red-50"
                : "border-[#EAEAEA] focus:border-fox"
            )}
            placeholder="Ex: Tech Jurídica Ltda"
            aria-describedby={errors.empresa ? "empresa-error" : undefined}
            aria-invalid={!!errors.empresa}
          />
          {errors.empresa && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              id="empresa-error"
              className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
              role="alert"
            >
              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
              {errors.empresa}
            </motion.p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contato"
            className="text-sm font-bold text-brown/70 block"
          >
            Nome do Contato
          </label>
          <input
            id="contato"
            type="text"
            value={fields.contato}
            onChange={handleChange("contato")}
            className={cn(
              "w-full bg-[#F9F9F9] border rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-fox/20 transition-all text-brown",
              errors.contato
                ? "border-red-400 bg-red-50"
                : "border-[#EAEAEA] focus:border-fox"
            )}
            placeholder="Ex: Ana Oliveira"
            aria-describedby={errors.contato ? "contato-error" : undefined}
            aria-invalid={!!errors.contato}
          />
          {errors.contato && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              id="contato-error"
              className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
              role="alert"
            >
              <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
              {errors.contato}
            </motion.p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-sm font-bold text-brown/70 block"
        >
          E-mail corporativo
        </label>
        <input
          id="email"
          type="email"
          value={fields.email}
          onChange={handleChange("email")}
          className={cn(
            "w-full bg-[#F9F9F9] border rounded-lg px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-fox/20 transition-all text-brown",
            errors.email
              ? "border-red-400 bg-red-50"
              : "border-[#EAEAEA] focus:border-fox"
          )}
          placeholder="contato@empresa.com"
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            id="email-error"
            className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
            {errors.email}
          </motion.p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-fox hover:bg-fox/90 active:scale-[0.98] focus:ring-4 focus:ring-fox/20 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 mt-2 shadow-md hover:shadow-[0_8px_24px_rgba(255,107,0,0.3)]"
      >
        Quero me tornar um Patrocinador
        <Send className="w-4 h-4" aria-hidden="true" />
      </button>
    </form>
  );
}

/* ─── Main Page ───────────────────────────────────────────── */
export default function Home() {
  const { startups, isLoading } = useStartups();
  const sortedStartups = [...startups].sort((a, b) => b.totalScore - a.totalScore);
  const topThree = sortedStartups.slice(0, 3);

  return (
    <div className="w-full">
      <GooeyFilter id="hero-goo" strength={15} />

      {/* ── 1. Hero — M2: left-aligned asymmetric layout ────── */}
      <section
        className="relative bg-[#FFFDF2] text-brown overflow-hidden min-h-[calc(100dvh-5rem)] flex items-center"
        aria-label="Seção principal"
      >
        {/* Background interativo */}
        <div
          className="absolute inset-0 z-0 overflow-hidden"
          style={{ filter: "url(#hero-goo)" }}
          aria-hidden="true"
        >
          <PixelTrail
            pixelSize={32}
            fadeDuration={1000}
            pixelClassName="bg-fox/20 rounded-full"
            className="opacity-50"
          />
          <PixelTrail
            pixelSize={48}
            fadeDuration={1500}
            pixelClassName="bg-gold/30 rounded-full"
            className="opacity-30"
          />
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#FFFDF2] to-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto max-w-7xl px-4 relative z-20 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-center">

            {/* ─ Coluna esquerda — conteúdo ─── */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex flex-col items-start text-left"
            >
              {/* Eyebrow pill badge — design-taste-frontend §4 */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 160, damping: 22, delay: 0.15 }}
                className="flex items-center gap-2 bg-fox/10 text-fox px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.2em] mb-7 border border-fox/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-fox animate-pulse" aria-hidden="true" />
                Hub de Inovação Jurídica
              </motion.div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-playfair leading-[0.92] mb-6 tracking-tight text-left">
                Quer fundar
                <br />
                uma{" "}
                <span className="relative inline-block px-2">
                  <motion.span
                    initial={{ color: "#2A1617" }}
                    animate={{ color: "#FFFFFF" }}
                    transition={{ delay: 0.7, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="relative z-10"
                  >
                    startup?
                  </motion.span>
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute inset-x-0 inset-y-0 bg-fox -rotate-1 z-0 shadow-lg origin-left rounded-sm"
                    aria-hidden="true"
                  />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-brown/65 mb-10 max-w-lg font-medium leading-relaxed">
                O Sanfran iLab te espera. Acompanhe a evolução do nosso
                portfólio em tempo real.
              </p>

              {/* M1: Button-in-Button CTA */}
              <a
                href="#ranking"
                className="group inline-flex items-center gap-3 bg-fox text-white pl-7 pr-2 py-2 rounded-full font-bold uppercase tracking-wider text-sm shadow-[0_10px_28px_rgba(255,107,0,0.35)] hover:shadow-[0_16px_40px_rgba(255,107,0,0.45)] hover:bg-fox/92 active:scale-[0.97] transition-all duration-300"
              >
                Ver o Ranking
                {/* Nested icon wrapper — kinetic hover */}
                <span
                  className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </motion.div>

            {/* ─ Coluna direita — stats decorativo ─── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 20, delay: 0.3 }}
              className="hidden lg:flex flex-col gap-4"
              aria-hidden="true"
            >
              {/* Card flutuante — mini ranking */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-[0_16px_48px_rgba(42,22,23,0.1)] p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-brown/30 mb-4">
                  Ranking Ilab — Ao vivo
                </p>
                <div className="space-y-3">
                  {[1, 2, 3].map((pos) => (
                    <div key={pos} className="flex items-center gap-3">
                      <span className="font-playfair font-black text-2xl text-brown/15 w-6 tabular">{pos}</span>
                      <div className="w-8 h-8 rounded-lg skeleton shrink-0" />
                      <div className="flex-1">
                        <div className="skeleton h-3 rounded w-24" />
                      </div>
                      <div className="skeleton h-5 w-10 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat pill */}
              <div className="flex gap-3">
                <div className="flex-1 bg-fox/10 rounded-xl p-4 border border-fox/15">
                  <p className="text-[10px] font-black uppercase tracking-widest text-fox/60 mb-1">Startups</p>
                  <p className="font-playfair font-black text-3xl text-fox tabular">12</p>
                </div>
                <div className="flex-1 bg-gold/8 rounded-xl p-4 border border-gold/15">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gold/60 mb-1">Ativas</p>
                  <p className="font-playfair font-black text-3xl text-gold tabular">9</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── 2. Ranking Ilab ──────────────────────────────────── */}
      <section
        id="ranking"
        className="py-24 bg-[#FFFDF2] relative overflow-hidden"
        aria-labelledby="ranking-title"
      >
        <div
          className="absolute -left-20 top-1/2 w-64 h-64 bg-fox/5 blur-3xl rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -right-20 top-1/4 w-96 h-96 bg-gold/5 blur-3xl rounded-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              id="ranking-title"
              className="text-5xl md:text-7xl font-bold font-playfair text-brown mb-3 tracking-tighter uppercase italic"
            >
              Ranking Ilab
            </h2>
            <div className="w-24 h-1.5 bg-fox mx-auto rounded-full" />
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white/70 backdrop-blur-xl rounded-[28px] shadow-2xl border border-white/60 overflow-hidden"
            >
              {/* Cabeçalho da tabela */}
              <div
                className="flex bg-brown/5 px-6 py-4 border-b border-brown/5 text-[10px] uppercase tracking-[0.3em] font-black text-brown/30"
                role="row"
                aria-label="Cabeçalho da tabela de ranking"
              >
                <div className="w-16 md:w-20 text-center" role="columnheader">
                  Rank
                </div>
                <div className="flex-1 px-4 text-left" role="columnheader">
                  Startup
                </div>
                <div
                  className="w-24 md:w-40 text-right"
                  role="columnheader"
                >
                  Performance
                </div>
              </div>

              {/* Linhas */}
              <div className="divide-y divide-brown/5" role="rowgroup">
                {isLoading ? (
                  <RankingSkeleton />
                ) : (
                  topThree.map((startup, index) => (
                    <motion.div key={startup.id} variants={itemVariants}>
                      <Link
                        to={`/startup/${startup.id}`}
                        className="flex flex-col sm:flex-row sm:items-center p-4 sm:p-6 hover:bg-fox/[0.03] transition-all group relative overflow-hidden"
                        aria-label={`${startup.name} — posição ${index + 1}, ${startup.totalScore} pontos`}
                      >
                        {/* Indicador lateral hover */}
                        <div
                          className="absolute left-0 top-0 h-full w-0 bg-fox group-hover:w-[3px] transition-all duration-300 rounded-r-full"
                          aria-hidden="true"
                        />

                        <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                          {/* Número */}
                          <div className="w-12 sm:w-20 text-center font-playfair font-black text-2xl sm:text-3xl text-brown/20 group-hover:text-fox transition-colors tabular">
                            {index + 1}
                          </div>

                          {/* Ícone */}
                          <div className="relative ml-2 sm:ml-0">
                            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-500 bg-white border border-gray-100">
                              <StartupIcon
                                name={startup.name}
                                className="w-full h-full"
                                iconClassName="w-6 h-6 text-brown/40 group-hover:text-fox transition-colors"
                              />
                            </div>
                            {index < 3 && (
                              <div
                                className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-sm border border-gold/20"
                                aria-hidden="true"
                              >
                                <Sparkles className="w-3 h-3 text-gold" />
                              </div>
                            )}
                          </div>

                          {/* Nome mobile */}
                          <div className="flex flex-col ml-4 sm:hidden">
                            <span className="font-playfair font-black text-lg text-brown group-hover:text-fox transition-all duration-500 line-clamp-1">
                              {startup.name}
                            </span>
                          </div>
                        </div>

                        {/* Nome desktop */}
                        <div className="hidden sm:flex flex-1 flex-col ml-4">
                          <span className="font-playfair font-black text-xl md:text-2xl text-brown group-hover:text-fox transition-all duration-500 line-clamp-1">
                            {startup.name}
                          </span>
                          <span className="text-[10px] text-brown/40 uppercase tracking-widest font-bold">
                            Inovação ativa
                          </span>
                        </div>

                        {/* Score */}
                        <div className="w-full sm:w-40 text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-0 border-brown/5 pt-4 sm:pt-0">
                          <div className="font-black text-2xl sm:text-3xl text-navy group-hover:text-fox transition-colors tabular">
                            {startup.totalScore}
                          </div>
                          <span className="text-[10px] text-brown/30 font-extrabold uppercase tracking-widest">
                            pontos
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Ver mais */}
              <div className="p-5 bg-brown/[0.03] flex justify-center border-t border-brown/5">
                <button
                  onClick={() => {
                    document
                      .getElementById("startups")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group flex items-center gap-2 text-brown font-black uppercase tracking-widest text-[10px] hover:text-fox transition-all focus-visible:outline-fox focus-visible:outline-2 rounded px-2 py-1"
                >
                  Ver todo o portfólio
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. Hub de Startups ───────────────────────────────── */}
      <section
        id="startups"
        className="py-20 bg-cream/30"
        aria-labelledby="startups-title"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2
                id="startups-title"
                className="text-4xl font-bold font-playfair text-brown mb-3"
              >
                Portfólio de Startups
              </h2>
              <p className="text-brown/60 max-w-xl leading-relaxed">
                Perfis dinâmicos carregados diretamente do banco de dados
                oficial do Sanfran iLab.
              </p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
          >
            {isLoading ? (
              <CardsSkeleton />
            ) : (
              startups.map((startup) => (
                <motion.div
                  variants={itemVariants}
                  key={startup.id}
                  className="h-[240px] sm:h-[280px] [perspective:1000px] group"
                >
                  <div
                    className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-focus-within:[transform:rotateY(180deg)]"
                    tabIndex={0}
                    role="button"
                    aria-label={`Ver detalhes da startup ${startup.name}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        window.location.href = `/startup/${startup.id}`;
                      }
                    }}
                  >
                    {/* Frente */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] border border-gold/10 rounded-2xl p-4 sm:p-6 bg-white flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg bg-gray-50 flex items-center justify-center p-2">
                        <StartupIcon
                          name={startup.name}
                          className="w-full h-full"
                          iconClassName="w-12 h-12 sm:w-16 sm:h-16 opacity-70"
                        />
                      </div>
                      <div className="mt-4 text-center">
                        <span className="font-playfair font-black text-xs sm:text-sm text-brown/50 uppercase tracking-[0.15em]">
                          {startup.name}
                        </span>
                      </div>
                    </div>

                    {/* Verso */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] border border-white/10 rounded-2xl p-4 sm:p-6 bg-brown/90 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-xl">
                      <h3 className="text-base sm:text-lg font-bold font-playfair text-white mb-6 line-clamp-2">
                        {startup.name}
                      </h3>
                      <Link
                        to={`/startup/${startup.id}`}
                        className="inline-flex items-center gap-2 bg-fox text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-fox/90 active:scale-95 transition-all shadow-lg hover:shadow-[0_8px_20px_rgba(255,107,0,0.4)]"
                        tabIndex={-1}
                      >
                        Ver detalhes
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>

      {/* ── 4. Seja um Patrocinador ──────────────────────────── */}
      <section
        id="patrocinadores"
        className="py-24 bg-white"
        aria-labelledby="sponsor-title"
      >
        <div className="container mx-auto px-4">
          <div className="bg-cream rounded-3xl shadow-lg border border-gold/20 overflow-hidden flex flex-col lg:flex-row">
            {/* Painel esquerdo */}
            <div className="w-full lg:w-5/12 bg-navy p-6 sm:p-12 text-white flex flex-col justify-center relative overflow-hidden">
              <div
                className="absolute top-0 right-0 p-8 opacity-10"
                aria-hidden="true"
              >
                <Target className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <h2
                  id="sponsor-title"
                  className="text-3xl sm:text-4xl font-bold font-playfair mb-4 text-fox leading-tight"
                >
                  Acelere o futuro com o Sanfran iLab.
                </h2>
                <p className="text-white/70 mb-8 text-lg leading-relaxed">
                  Cotas abertas para novos patrocinadores.
                </p>
                <ul className="space-y-4" aria-label="Benefícios do patrocínio">
                  <li className="flex items-center gap-3">
                    <div className="bg-gold/20 p-2 rounded-full shrink-0">
                      <Building2
                        className="w-5 h-5 text-gold"
                        aria-hidden="true"
                      />
                    </div>
                    <span className="text-white/90">
                      Destaque sua marca no ecossistema
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="bg-fox/20 p-2 rounded-full shrink-0">
                      <Star className="w-5 h-5 text-fox" aria-hidden="true" />
                    </div>
                    <span className="text-white/90">
                      Acesso a relatórios e times
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Formulário direito */}
            <div className="w-full lg:w-7/12 p-6 sm:p-12 bg-white">
              <h3 className="text-2xl font-bold font-playfair text-brown mb-6">
                Torne-se um parceiro
              </h3>
              <SponsorForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
