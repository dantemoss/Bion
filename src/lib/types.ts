/**
 * Type definitions for MyBento application
 * 
 * Centralized type definitions for database models and entities.
 */

// ============================================================================
// DATABASE MODELS
// ============================================================================

/**
 * Block - Representa un bloque/enlace en el perfil del usuario
 */
export interface Block {
  id: string;
  user_id: string;
  title: string | null;
  url: string | null;
  type: string;
  content: Record<string, unknown>;
  position: number;
  clicks: number | null;
  is_active: boolean;
  is_highlighted: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Profile - Representa el perfil público del usuario
 */
export interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  layout: string | null;
  notifications_enabled: boolean;
  newsletter_enabled: boolean;
  spinning_text_enabled: boolean;
  spinning_text_set: string | null;
  avatar_position: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// FORM DATA TYPES
// ============================================================================

/**
 * BlockFormData - Datos para crear/actualizar bloques
 */
export interface BlockFormData {
  title: string;
  url: string;
  type: string;
  is_active?: boolean;
  is_highlighted?: boolean;
}

/**
 * ProfileFormData - Datos para actualizar perfil
 */
export interface ProfileFormData {
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
  bio?: string;
  notifications_enabled?: boolean;
  newsletter_enabled?: boolean;
  spinning_text_enabled?: boolean;
  spinning_text_set?: string | null;
  avatar_position?: string | null;
}
