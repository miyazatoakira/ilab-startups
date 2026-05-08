// src/data/mockData.ts

export type MemberRole = 'CEO' | 'CTO' | 'PM' | 'CMO' | 'Outro';
export type DeliverableStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

export interface StartupMember {
  id: string;
  name: string;
  role: MemberRole;
  customRole?: string;
  isLeader: boolean;
  avatarUrl?: string;
}

export interface DeliverableType {
  id: string;
  title: string;
  description: string;
  xpValue: number;
  icon: string;
  requiresLink: boolean;
  sortOrder: number;
}

export interface StartupDeliverable {
  id: string;
  typeId: string;
  status: DeliverableStatus;
  evidenceUrl?: string;
  evidenceNotes?: string;
  description?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  xpEarned: number;
  type?: DeliverableType; // Join do banco
}

export interface StartupPost {
  id: string;
  startupId: string;
  authorId?: string;
  title: string;
  body?: string;            // Markdown
  coverImageUrl?: string;
  tags: string[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StartupDocument {
  id: string;
  startupId: string;
  deliverableTypeId?: string;
  name: string;
  fileUrl: string;
  fileType: 'pdf' | 'image' | 'video' | 'link' | string;
  fileSizeBytes?: number;
  description?: string;
  uploadedBy?: string;
  createdAt?: string;
}

export interface Startup {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  coverImageUrl?: string;
  shortPitch?: string;
  sector?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  pitchUrl?: string;
  cohort?: string;
  leaderPhone?: string;
  instagramUrl?: string;
  totalScore: number;
  status: string;
  members: StartupMember[];
  deliverables: StartupDeliverable[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'founder' | 'public';
  startupId?: string;
}

// ============================================================================
// DICIONÁRIO DE ENTREGÁVEIS (GAMIFICAÇÃO)
// ============================================================================
export const deliverableTypes: Record<string, DeliverableType> = {
  'pitch_deck': { id: 'pitch_deck', title: 'Pitch Deck', description: 'Apresentação comercial e institucional da startup.', xpValue: 100, icon: 'presentation', requiresLink: true, sortOrder: 1 },
  'landing_page': { id: 'landing_page', title: 'Landing Page', description: 'Site de aterrissagem para captura de leads e presença digital.', xpValue: 80, icon: 'globe', requiresLink: true, sortOrder: 2 },
  'market_map': { id: 'market_map', title: 'Mapeamento de Mercado', description: 'Documento com stakeholders, concorrentes, ICP e fluxos de dinheiro.', xpValue: 120, icon: 'map', requiresLink: true, sortOrder: 3 },
  'poc': { id: 'poc', title: 'Prova de Conceito', description: 'Protótipo inicial ou PoC validando a viabilidade técnica.', xpValue: 150, icon: 'beaker', requiresLink: true, sortOrder: 4 },
  'discovery_call': { id: 'discovery_call', title: 'Discovery Call', description: 'Call com pelo menos um cliente, documentada ou gravada.', xpValue: 100, icon: 'phone-call', requiresLink: true, sortOrder: 5 },
  'instagram': { id: 'instagram', title: 'Conta no Instagram', description: 'Perfil ativo no Instagram para marketing e comunidade.', xpValue: 50, icon: 'instagram', requiresLink: true, sortOrder: 6 },
  'collabs_growth': { id: 'collabs_growth', title: 'Colabs e Growth', description: 'Parcerias realizadas para crescimento mútuo e expansão.', xpValue: 80, icon: 'trending-up', requiresLink: true, sortOrder: 7 },
  'events': { id: 'events', title: 'Ida a Eventos', description: 'Representação da startup e aceleradora em eventos.', xpValue: 60, icon: 'ticket', requiresLink: true, sortOrder: 8 },
  'pitch_competition': { id: 'pitch_competition', title: 'Pitchs em Competições', description: 'Apresentação em competições e hackathons.', xpValue: 100, icon: 'award', requiresLink: true, sortOrder: 9 },
  'demo_day': { id: 'demo_day', title: 'Demo Day', description: 'Apresentação final para banca avaliadora.', xpValue: 200, icon: 'flag', requiresLink: false, sortOrder: 10 },
};

// ============================================================================
// MOCK DATA (Para usar enquanto não conecta o Supabase)
// ============================================================================
export const mockStartups: Startup[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Equipe Alpha',
    description: 'Plataforma para automação de diligência legal.',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=256&h=256&auto=format&fit=crop',
    leaderPhone: '+55 11 99999-9999',
    instagramUrl: 'https://instagram.com/alpha',
    totalScore: 300,
    status: 'Concluído',
    members: [
      { id: 'm1', name: 'Ana Silva', role: 'CEO', isLeader: true, avatarUrl: 'https://ui-avatars.com/api/?name=Ana+Silva&background=4B2B2C&color=FFECB3' },
      { id: 'm2', name: 'Bruno Costa', role: 'CTO', isLeader: false, avatarUrl: 'https://ui-avatars.com/api/?name=Bruno+Costa&background=4B2B2C&color=FFECB3' }
    ],
    deliverables: [
      { id: 'sd1', typeId: 'pitch_deck', status: 'approved', evidenceUrl: '#link', xpEarned: 100, type: deliverableTypes['pitch_deck'] },
      { id: 'sd2', typeId: 'landing_page', status: 'approved', evidenceUrl: '#link', xpEarned: 80, type: deliverableTypes['landing_page'] },
      { id: 'sd3', typeId: 'market_map', status: 'approved', evidenceUrl: '#link', xpEarned: 120, type: deliverableTypes['market_map'] },
      { id: 'sd4', typeId: 'poc', status: 'submitted', evidenceUrl: '#link', xpEarned: 0, type: deliverableTypes['poc'] }
    ]
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Equipe Beta',
    description: 'Jurimetria para predição de decisões judiciais no STF.',
    logoUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=256&h=256&auto=format&fit=crop',
    leaderPhone: '+55 11 98888-8888',
    instagramUrl: 'https://instagram.com/beta',
    totalScore: 100,
    status: 'Pendente',
    members: [
      { id: 'm3', name: 'Carla Mendes', role: 'CEO', isLeader: true, avatarUrl: 'https://ui-avatars.com/api/?name=Carla+Mendes&background=4B2B2C&color=FFECB3' },
      { id: 'm4', name: 'Daniel Souza', role: 'PM', isLeader: false, avatarUrl: 'https://ui-avatars.com/api/?name=Daniel+Souza&background=4B2B2C&color=FFECB3' }
    ],
    deliverables: [
      { id: 'sd5', typeId: 'pitch_deck', status: 'approved', evidenceUrl: '#link', xpEarned: 100, type: deliverableTypes['pitch_deck'] },
      { id: 'sd6', typeId: 'landing_page', status: 'rejected', evidenceUrl: '#link', evidenceNotes: 'Link quebrado, por favor reenvie.', xpEarned: 0, type: deliverableTypes['landing_page'] }
    ]
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Equipe Gama',
    description: 'Marketplace de advogados correspondentes em tempo real.',
    logoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=256&h=256&auto=format&fit=crop',
    leaderPhone: '+55 11 97777-7777',
    instagramUrl: 'https://instagram.com/gama',
    totalScore: 0,
    status: 'Pendente',
    members: [
      { id: 'm5', name: 'Eduardo Lima', role: 'CEO', isLeader: true, avatarUrl: 'https://ui-avatars.com/api/?name=Eduardo+Lima&background=4B2B2C&color=FFECB3' }
    ],
    deliverables: [
      { id: 'sd7', typeId: 'pitch_deck', status: 'submitted', evidenceUrl: '#link', xpEarned: 0, type: deliverableTypes['pitch_deck'] }
    ]
  }
];

export const mockUsers: Record<string, User> = {
  admin: {
    id: 'admin-1',
    name: 'Administrador',
    email: 'admin@foxlaw.com',
    role: 'admin'
  }
};
