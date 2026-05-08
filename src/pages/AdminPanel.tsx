import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  CheckCircle,
  XCircle,
  ExternalLink,
  Clock,
  RefreshCw,
  AlertTriangle,
  ChevronRight,
  Inbox,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getPendingDeliverables, reviewDeliverable } from '../data/supabaseService';
import { mockStartups, deliverableTypes } from '../data/mockData';
import { cn } from '../lib/utils';
import { supabase } from '../data/supabaseService';

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface PendingItem {
  id: string;
  startupId: string;
  startupName: string;
  typeId: string;
  typeInfo: typeof deliverableTypes[string];
  evidenceUrl?: string;
  description?: string;
  submittedAt?: string;
}

// ─── Modal de Revisão ─────────────────────────────────────────────────────────
interface ReviewModalProps {
  item: PendingItem;
  action: 'approved' | 'rejected';
  onConfirm: (notes: string) => void;
  onClose: () => void;
  isProcessing: boolean;
}

function ReviewModal({ item, action, onConfirm, onClose, isProcessing }: ReviewModalProps) {
  const [notes, setNotes] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        {/* Header */}
        <div className={cn(
          "p-6 rounded-t-2xl flex items-center gap-3",
          action === 'approved' ? 'bg-teal/5 border-b border-teal/10' : 'bg-red-50 border-b border-red-100'
        )}>
          {action === 'approved'
            ? <CheckCircle className="w-6 h-6 text-teal" />
            : <XCircle className="w-6 h-6 text-red-500" />}
          <div>
            <h3 className="font-bold text-graphite">
              {action === 'approved' ? 'Aprovar Entregável' : 'Rejeitar Entregável'}
            </h3>
            <p className="text-xs text-gray-500">
              {item.typeInfo?.title} — {item.startupName}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Evidência */}
          {item.evidenceUrl && (
            <a
              href={item.evidenceUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-navy font-medium hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Ver evidência enviada
            </a>
          )}

          {/* Descrição do founder */}
          {item.description && (
            <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-600 border border-gray-100">
              <span className="font-bold text-xs text-gray-400 uppercase tracking-wider block mb-1">Descrição do Founder</span>
              {item.description}
            </div>
          )}

          {/* Campo de feedback */}
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-2">
              {action === 'approved' ? 'Observação (opcional)' : 'Motivo da Rejeição *'}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder={
                action === 'approved'
                  ? 'Ex: Ótima apresentação, parabéns!'
                  : 'Ex: Link quebrado, por favor reenvie com acesso público...'
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm text-navy outline-none focus:ring-2 focus:ring-fox/20 focus:border-fox resize-none transition-all"
            />
          </div>
        </div>

        {/* Ações */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-3 border border-gray-200 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              if (action === 'rejected' && !notes.trim()) return;
              onConfirm(notes);
            }}
            disabled={isProcessing || (action === 'rejected' && !notes.trim())}
            className={cn(
              "flex-1 py-3 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50",
              action === 'approved' ? 'bg-teal hover:bg-teal/90' : 'bg-red-500 hover:bg-red-600'
            )}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : action === 'approved' ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Card de Entregável Pendente ──────────────────────────────────────────────
interface PendingCardProps extends React.Attributes {
  item: PendingItem;
  onApprove: (item: PendingItem) => void;
  onReject: (item: PendingItem) => void;
}

function PendingCard({ item, onApprove, onReject }: PendingCardProps) {
  const formattedDate = item.submittedAt
    ? new Date(item.submittedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Sem data';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all"
    >
      {/* Header do card */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="bg-yellow-50 border border-yellow-100 p-2 rounded-xl shrink-0">
            <Clock className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider mb-0.5">Em Análise</p>
            <h3 className="font-bold text-graphite text-base leading-tight">
              {item.typeInfo?.title || item.typeId}
            </h3>
            <Link
              to={`/startup/${item.startupId}`}
              className="inline-flex items-center gap-1 text-xs text-fox font-bold hover:underline mt-0.5"
            >
              {item.startupName}
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold text-gray-400 block">XP disponível</span>
          <span className="text-lg font-black text-gold">+{item.typeInfo?.xpValue || 0}</span>
        </div>
      </div>

      {/* Descrição do founder */}
      {item.description && (
        <div className="bg-gray-50 p-3 rounded-xl text-sm text-gray-600 mb-3 border border-gray-100">
          <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Relato do Founder</span>
          <p className="line-clamp-3">{item.description}</p>
        </div>
      )}

      {/* Link da evidência */}
      {item.evidenceUrl && (
        <a
          href={item.evidenceUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-sm text-navy font-medium hover:underline mb-4"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{item.evidenceUrl}</span>
        </a>
      )}

      {/* Rodapé */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">{formattedDate}</span>
        <div className="flex gap-2">
          <button
            onClick={() => onReject(item)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all"
          >
            <XCircle className="w-3.5 h-3.5" />
            Rejeitar
          </button>
          <button
            onClick={() => onApprove(item)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-teal hover:bg-teal/90 px-3 py-1.5 rounded-lg transition-all shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Aprovar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Painel Principal ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { user } = useAuth();
  const [pending, setPending] = useState<PendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalItem, setModalItem] = useState<PendingItem | null>(null);
  const [modalAction, setModalAction] = useState<'approved' | 'rejected'>('approved');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Mocks para desenvolvimento sem Supabase
  const mockPending: PendingItem[] = mockStartups.flatMap(s =>
    s.deliverables
      .filter(d => d.status === 'submitted')
      .map(d => ({
        id: d.id,
        startupId: s.id,
        startupName: s.name,
        typeId: d.typeId,
        typeInfo: deliverableTypes[d.typeId],
        evidenceUrl: d.evidenceUrl,
        description: (d as any).description,
        submittedAt: d.submittedAt
      }))
  );

  const loadPending = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (supabase) {
        const data = await getPendingDeliverables();
        setPending(data);
      } else {
        // Fallback mock
        setPending(mockPending);
      }
    } catch (err: any) {
      setError('Não foi possível carregar as submissões pendentes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPending();
  }, [loadPending]);

  const handleOpenModal = (item: PendingItem, action: 'approved' | 'rejected') => {
    setModalItem(item);
    setModalAction(action);
  };

  const handleConfirmReview = async (notes: string) => {
    if (!modalItem || !user) return;
    setIsProcessing(true);
    try {
      if (supabase) {
        await reviewDeliverable(
          modalItem.startupId,
          modalItem.typeId,
          modalAction,
          notes,
          modalItem.typeInfo?.xpValue || 0,
          user.name
        );
      }
      // Atualiza a lista local removendo o item revisado
      setPending(prev => prev.filter(p => p.id !== modalItem.id));
      setSuccessMsg(modalAction === 'approved' ? '✓ Entregável aprovado com sucesso!' : '✗ Entregável rejeitado.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setError('Erro ao processar: ' + err.message);
    } finally {
      setIsProcessing(false);
      setModalItem(null);
    }
  };

  // Guard: apenas admin acessa
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-center p-8">
        <div>
          <AlertTriangle className="w-12 h-12 text-fox mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-playfair text-navy mb-2">Acesso Restrito</h2>
          <p className="text-gray-500 mb-6">Esta área é exclusiva para administradores do Sanfran iLab.</p>
          <Link to="/" className="text-fox font-bold hover:underline">← Voltar ao portal</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF2] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-8 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-navy/5 p-3 rounded-2xl">
                <Bell className="w-6 h-6 text-navy" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-playfair text-navy">Painel de Aprovações</h1>
                <p className="text-sm text-gray-500">Revise e valide os entregáveis enviados pelos founders.</p>
              </div>
            </div>
            <button
              onClick={loadPending}
              disabled={isLoading}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-navy border border-gray-200 px-4 py-2 rounded-xl transition-all hover:border-gray-300"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Feedback messages */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 bg-teal/10 border border-teal/20 text-teal font-bold px-5 py-4 rounded-xl"
            >
              {successMsg}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 bg-red-50 border border-red-100 text-red-600 font-bold px-5 py-4 rounded-xl"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-8 h-8 text-fox animate-spin" />
            <p className="text-sm text-gray-400 font-medium">Carregando submissões...</p>
          </div>
        ) : pending.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="bg-gray-50 p-6 rounded-full">
              <Inbox className="w-10 h-10 text-gray-300" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-graphite mb-1">Nenhuma submissão pendente</h3>
              <p className="text-sm text-gray-400">Quando os founders enviarem entregáveis, eles aparecerão aqui.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-yellow-400 text-white text-xs font-black px-2.5 py-1 rounded-full">
                {pending.length}
              </span>
              <h2 className="font-bold text-graphite">submissão{pending.length !== 1 ? 'ões' : ''} aguardando revisão</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {pending.map(item => (
                  <React.Fragment key={item.id}>
                    <PendingCard
                      item={item}
                      onApprove={(i) => handleOpenModal(i, 'approved')}
                      onReject={(i) => handleOpenModal(i, 'rejected')}
                    />
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalItem && (
          <ReviewModal
            item={modalItem}
            action={modalAction}
            onConfirm={handleConfirmReview}
            onClose={() => setModalItem(null)}
            isProcessing={isProcessing}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
