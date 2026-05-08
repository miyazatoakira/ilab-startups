// src/data/supabaseService.ts
import { createClient } from '@supabase/supabase-js';
import { Startup, StartupPost, StartupDocument, deliverableTypes } from './mockData';

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// ─── Startups ────────────────────────────────────────────────────────────────

export async function fetchStartupsFromSupabase(): Promise<Startup[]> {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('startups')
    .select(`*, startup_scores(total_score), startup_members(*), startup_deliverables(*)`);

  if (error) throw error;

  return (data || []).map(mapStartup).sort((a, b) => b.totalScore - a.totalScore);
}

export async function fetchStartupById(id: string): Promise<Startup | null> {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('startups')
    .select(`*, startup_scores(total_score), startup_members(*), startup_deliverables(*)`)
    .eq('id', id)
    .single();

  if (error) return null;
  return mapStartup(data);
}

export async function createStartup(payload: {
  name: string;
  description: string;
  shortPitch?: string;
  sector?: string;
  cohort?: string;
  leaderPhone?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  linkedinUrl?: string;
  logoUrl?: string;
  coverImageUrl?: string;
}): Promise<string> {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('startups')
    .insert({
      name: payload.name,
      description: payload.description,
      short_pitch: payload.shortPitch,
      sector: payload.sector,
      cohort: payload.cohort,
      leader_phone: payload.leaderPhone,
      instagram_url: payload.instagramUrl,
      website_url: payload.websiteUrl,
      linkedin_url: payload.linkedinUrl,
      logo_url: payload.logoUrl,
      cover_image_url: payload.coverImageUrl,
      status: 'Pendente'
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateStartup(id: string, payload: Partial<{
  name: string;
  description: string;
  shortPitch: string;
  sector: string;
  cohort: string;
  leaderPhone: string;
  instagramUrl: string;
  websiteUrl: string;
  linkedinUrl: string;
  pitchUrl: string;
  logoUrl: string;
  coverImageUrl: string;
  status: string;
}>) {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { error } = await supabase
    .from('startups')
    .update({
      name: payload.name,
      description: payload.description,
      short_pitch: payload.shortPitch,
      sector: payload.sector,
      cohort: payload.cohort,
      leader_phone: payload.leaderPhone,
      instagram_url: payload.instagramUrl,
      website_url: payload.websiteUrl,
      linkedin_url: payload.linkedinUrl,
      pitch_url: payload.pitchUrl,
      logo_url: payload.logoUrl,
      cover_image_url: payload.coverImageUrl,
      status: payload.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteStartup(id: string) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase.from('startups').delete().eq('id', id);
  if (error) throw error;
}

// ─── Membros ─────────────────────────────────────────────────────────────────

export async function upsertStartupMember(startupId: string, member: {
  id?: string;
  name: string;
  role: string;
  customRole?: string;
  isLeader?: boolean;
}) {
  if (!supabase) throw new Error('Supabase não configurado.');

  if (member.id) {
    const { error } = await supabase
      .from('startup_members')
      .update({ name: member.name, role: member.role, custom_role: member.customRole, is_leader: member.isLeader })
      .eq('id', member.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('startup_members')
      .insert({ startup_id: startupId, name: member.name, role: member.role, custom_role: member.customRole, is_leader: member.isLeader || false });
    if (error) throw error;
  }
}

export async function deleteStartupMember(memberId: string) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase.from('startup_members').delete().eq('id', memberId);
  if (error) throw error;
}

// ─── Founders (Gestão de Acesso) ─────────────────────────────────────────────

export async function getFounders(): Promise<Array<{
  id: string; email: string; name: string; startupId?: string; startupName?: string;
}>> {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('user_roles')
    .select(`id, startup_id, startups(name)`)
    .eq('role', 'founder');

  if (error) throw error;

  return (data || []).map((r: any) => ({
    id: r.id,
    email: '',
    name: '',
    startupId: r.startup_id,
    startupName: r.startups?.name
  }));
}

export async function createFounderAccount(email: string, password: string, startupId: string) {
  if (!supabase) throw new Error('Supabase não configurado.');

  // Cria o usuário via signUp (requer "Confirm email" desativado no painel Supabase)
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const userId = data.user?.id;
  if (!userId) throw new Error('Falha ao obter ID do usuário criado.');

  // Vincula como founder
  const { error: roleError } = await supabase
    .from('user_roles')
    .insert({ id: userId, role: 'founder', startup_id: startupId });

  if (roleError) throw roleError;
  return userId;
}

export async function linkFounderToStartup(userId: string, startupId: string) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase
    .from('user_roles')
    .upsert({ id: userId, role: 'founder', startup_id: startupId });
  if (error) throw error;
}

// ─── Entregáveis ─────────────────────────────────────────────────────────────

export async function getPendingDeliverables() {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('startup_deliverables')
    .select(`*, startups(id, name)`)
    .eq('status', 'submitted')
    .order('submitted_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((d: any) => ({
    id: d.id,
    startupId: d.startup_id,
    startupName: d.startups?.name || 'Desconhecida',
    typeId: d.type_id,
    typeInfo: deliverableTypes[d.type_id],
    status: d.status,
    evidenceUrl: d.evidence_url,
    description: d.description,
    submittedAt: d.submitted_at,
  }));
}

export async function submitDeliverable(startupId: string, typeId: string, evidenceUrl: string, description: string) {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { error } = await supabase
    .from('startup_deliverables')
    .upsert({
      startup_id: startupId,
      type_id: typeId,
      evidence_url: evidenceUrl,
      description,
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      xp_earned: 0
    }, { onConflict: 'startup_id,type_id' });

  if (error) throw error;
}

export async function reviewDeliverable(
  startupId: string, typeId: string, status: 'approved' | 'rejected',
  notes: string, xpValue: number, adminName: string
) {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { error } = await supabase
    .from('startup_deliverables')
    .update({
      status,
      evidence_notes: notes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminName,
      xp_earned: status === 'approved' ? xpValue : 0
    })
    .match({ startup_id: startupId, type_id: typeId });

  if (error) throw error;
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export async function getPosts(startupId?: string): Promise<StartupPost[]> {
  if (!supabase) throw new Error('Supabase não configurado.');

  let query = supabase.from('startup_posts').select('*').order('created_at', { ascending: false });
  if (startupId) query = query.eq('startup_id', startupId);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(mapPost);
}

export async function getAllPosts(): Promise<Array<StartupPost & { startupName: string }>> {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('startup_posts')
    .select(`*, startups(name)`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((p: any) => ({ ...mapPost(p), startupName: p.startups?.name || '' }));
}

export async function createPost(post: {
  startupId: string;
  authorId: string;
  title: string;
  body: string;
  coverImageUrl?: string;
  tags: string[];
}): Promise<string> {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase
    .from('startup_posts')
    .insert({
      startup_id: post.startupId,
      author_id: post.authorId,
      title: post.title,
      body: post.body,
      cover_image_url: post.coverImageUrl,
      tags: post.tags,
      is_published: true
    })
    .select('id')
    .single();

  if (error) throw error;
  return data.id;
}

export async function updatePost(id: string, payload: Partial<{
  title: string; body: string; coverImageUrl: string; tags: string[]; isPublished: boolean;
}>) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase
    .from('startup_posts')
    .update({ title: payload.title, body: payload.body, cover_image_url: payload.coverImageUrl, tags: payload.tags, is_published: payload.isPublished, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

export async function deletePost(id: string) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase.from('startup_posts').delete().eq('id', id);
  if (error) throw error;
}

// ─── Documentos ──────────────────────────────────────────────────────────────

export async function getDocuments(startupId: string, typeId?: string): Promise<StartupDocument[]> {
  if (!supabase) throw new Error('Supabase não configurado.');

  let query = supabase.from('startup_documents').select('*').eq('startup_id', startupId).order('created_at', { ascending: false });
  if (typeId) query = query.eq('deliverable_type_id', typeId);

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(mapDocument);
}

export async function createDocument(doc: {
  startupId: string; deliverableTypeId?: string; name: string;
  fileUrl: string; fileType: string; description?: string; uploadedBy?: string; fileSizeBytes?: number;
}) {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { error } = await supabase.from('startup_documents').insert({
    startup_id: doc.startupId,
    deliverable_type_id: doc.deliverableTypeId || null,
    name: doc.name,
    file_url: doc.fileUrl,
    file_type: doc.fileType,
    description: doc.description,
    uploaded_by: doc.uploadedBy,
    file_size_bytes: doc.fileSizeBytes
  });

  if (error) throw error;
}

export async function deleteDocument(id: string) {
  if (!supabase) throw new Error('Supabase não configurado.');
  const { error } = await supabase.from('startup_documents').delete().eq('id', id);
  if (error) throw error;
}

// ─── Upload de Arquivos (Supabase Storage) ────────────────────────────────────

export async function uploadFile(
  bucket: 'startup-media' | 'startup-docs',
  path: string,
  file: File
): Promise<string> {
  if (!supabase) throw new Error('Supabase não configurado.');

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

// ─── Mappers Internos ─────────────────────────────────────────────────────────

function mapStartup(s: any): Startup {
  return {
    id: s.id,
    name: s.name,
    description: s.description || '',
    logoUrl: s.logo_url,
    coverImageUrl: s.cover_image_url,
    shortPitch: s.short_pitch,
    sector: s.sector,
    websiteUrl: s.website_url,
    linkedinUrl: s.linkedin_url,
    pitchUrl: s.pitch_url,
    cohort: s.cohort,
    leaderPhone: s.leader_phone,
    instagramUrl: s.instagram_url,
    totalScore: s.startup_scores?.[0]?.total_score || 0,
    status: s.status || 'Pendente',
    members: (s.startup_members || []).map((m: any) => ({
      id: m.id, name: m.name, role: m.role,
      customRole: m.custom_role, isLeader: m.is_leader, avatarUrl: m.avatar_url
    })),
    deliverables: (s.startup_deliverables || []).map((d: any) => ({
      id: d.id, typeId: d.type_id, status: d.status,
      evidenceUrl: d.evidence_url, evidenceNotes: d.evidence_notes,
      description: d.description, submittedAt: d.submitted_at,
      reviewedAt: d.reviewed_at, reviewedBy: d.reviewed_by,
      xpEarned: d.xp_earned, type: deliverableTypes[d.type_id]
    }))
  };
}

function mapPost(p: any): StartupPost {
  return {
    id: p.id, startupId: p.startup_id, authorId: p.author_id,
    title: p.title, body: p.body, coverImageUrl: p.cover_image_url,
    tags: p.tags || [], isPublished: p.is_published,
    createdAt: p.created_at, updatedAt: p.updated_at
  };
}

function mapDocument(d: any): StartupDocument {
  return {
    id: d.id, startupId: d.startup_id, deliverableTypeId: d.deliverable_type_id,
    name: d.name, fileUrl: d.file_url, fileType: d.file_type,
    fileSizeBytes: d.file_size_bytes, description: d.description,
    uploadedBy: d.uploaded_by, createdAt: d.created_at
  };
}
