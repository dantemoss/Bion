"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { motion, useReducedMotion } from "framer-motion";
import { UploadCloud, Loader2, X } from "lucide-react";
import { SPINNING_TEXT_SET_LABELS, type SpinningTextSetKey } from "@/lib/spinning-text-presets";
import { FormEvent, useState, useRef, ChangeEvent } from "react";
import { updateProfile } from "@/app/admin/settings/actions";
import { toast } from "sonner";

function parseAvatarPosition(value: string | null | undefined): { x: number; y: number } {
  if (!value || typeof value !== "string") return { x: 50, y: 50 };
  const match = value.trim().match(/^(\d+)%\s+(\d+)%$/);
  if (!match) return { x: 50, y: 50 };
  return {
    x: Math.min(100, Math.max(0, parseInt(match[1], 10))),
    y: Math.min(100, Math.max(0, parseInt(match[2], 10))),
  };
}

interface Profile {
  avatar_url?: string | null;
  full_name?: string | null;
  username?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  notifications_enabled?: boolean;
  newsletter_enabled?: boolean;
  spinning_text_enabled?: boolean;
  spinning_text_set?: string | null;
  avatar_position?: string | null;
}

interface GlassProfileSettingsCardProps {
  profile: Profile | null;
}

export function GlassProfileSettingsCard({ profile }: GlassProfileSettingsCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState(profile?.notifications_enabled ?? true);
  const [newsletter, setNewsletter] = useState(profile?.newsletter_enabled ?? false);
  const [spinningTextEnabled, setSpinningTextEnabled] = useState(profile?.spinning_text_enabled ?? false);
  const [spinningTextSet, setSpinningTextSet] = useState<string>(profile?.spinning_text_set ?? "set1");
  const [bio, setBio] = useState(profile?.bio || "");
  const [imagePreview, setImagePreview] = useState<string | null>(profile?.avatar_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [avatarPosition, setAvatarPosition] = useState<{ x: number; y: number }>(() =>
    parseAvatarPosition(profile?.avatar_position)
  );
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; startPos: { x: number; y: number } } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor seleccioná un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no puede superar los 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setAvatarPosition({ x: 50, y: 50 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const avatarPositionStr = `${avatarPosition.x}% ${avatarPosition.y}%`;

  const handleAvatarPointerDown = (e: React.PointerEvent) => {
    if (!imagePreview) return;
    e.preventDefault();
    setIsDraggingAvatar(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPos: { ...avatarPosition },
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleAvatarPointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current || !isDraggingAvatar) return;
    const { x, y, startPos } = dragStartRef.current;
    const deltaX = e.clientX - x;
    const deltaY = e.clientY - y;
    const sensitivity = 0.8;
    setAvatarPosition({
      x: Math.min(100, Math.max(0, startPos.x - deltaX * sensitivity)),
      y: Math.min(100, Math.max(0, startPos.y - deltaY * sensitivity)),
    });
  };

  const handleAvatarPointerUp = (e: React.PointerEvent) => {
    if (dragStartRef.current) {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      dragStartRef.current = null;
    }
    setIsDraggingAvatar(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Agregar campos adicionales
      formData.set('notifications_enabled', notifications.toString());
      formData.set('newsletter_enabled', newsletter.toString());
      formData.set('spinning_text_enabled', spinningTextEnabled.toString());
      formData.set('spinning_text_set', spinningTextEnabled ? spinningTextSet : "");
      formData.set('avatar_position', avatarPositionStr);
      formData.set('bio', bio);
      
      // Solo agregar el archivo si hay uno nuevo seleccionado
      if (selectedFile) {
        formData.set('avatar', selectedFile);
      }

      const result = await updateProfile(formData);
      
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Perfil actualizado correctamente");
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error("Error inesperado al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  // Extraer iniciales del nombre
  const getInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return profile?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: shouldReduceMotion ? "linear" : [0.16, 1, 0.3, 1],
      }}
      className="group w-full max-w-3xl rounded-3xl overflow-hidden border border-border/60 bg-card/85 p-8 backdrop-blur-xl sm:p-12 relative"
      aria-labelledby="glass-profile-settings-title"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-foreground/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10"
      />
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Profile
          </div>
          <h1
            id="glass-profile-settings-title"
            className="mt-3 text-2xl font-semibold text-foreground sm:text-3xl"
          >
            Configuración de Perfil
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Actualizá tu avatar, información personal y preferencias de notificaciones.
          </p>
        </div>
        <Badge className="group gap-2 rounded-full border border-border/60 bg-white/5 px-4 py-2 text-muted-foreground transition-colors duration-300 hover:border-primary/60 hover:bg-primary/15 hover:text-primary">
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
          Auto-guardado activado
        </Badge>
      </div>

      <form className="grid gap-8 sm:grid-cols-5" onSubmit={handleSubmit}>
        <div className="sm:col-span-2">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border/60 bg-background/40 p-6 backdrop-blur">
            <div className="relative">
              <div
                className="relative h-24 w-24 rounded-full border border-border/60 overflow-hidden bg-muted"
                role="img"
                aria-label="Vista previa del avatar"
                style={{ cursor: imagePreview ? (isDraggingAvatar ? "grabbing" : "grab") : undefined }}
                onPointerDown={handleAvatarPointerDown}
                onPointerMove={handleAvatarPointerMove}
                onPointerUp={handleAvatarPointerUp}
                onPointerLeave={() => {
                  if (dragStartRef.current) {
                    dragStartRef.current = null;
                    setIsDraggingAvatar(false);
                  }
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Avatar preview"
                    className="h-full w-full select-none object-cover object-center pointer-events-none rounded-full"
                    style={{ objectPosition: avatarPositionStr }}
                    draggable={false}
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-lg font-semibold text-primary">
                    {getInitials()}
                  </span>
                )}
              </div>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                  aria-label="Eliminar imagen"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {imagePreview && (
              <p className="text-xs text-muted-foreground text-center">
                Arrastrá la imagen para centrarla. No se estirará al guardar.
              </p>
            )}
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {profile?.full_name || profile?.username || 'Usuario'}
              </p>
              <p className="text-xs text-muted-foreground">
                @{profile?.username || 'username'}
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              id="avatar-upload"
              name="avatar"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-border/60 bg-white/5 px-4 py-2 text-sm text-foreground"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Actualizar avatar
            </Button>
            {selectedFile && (
              <p className="text-xs text-muted-foreground">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6 sm:col-span-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-full-name">Nombre Completo</Label>
              <Input
                id="profile-full-name"
                name="fullName"
                defaultValue={profile?.full_name || ""}
                className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                autoComplete="name"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-username">Nombre de Usuario</Label>
              <Input
                id="profile-username"
                name="username"
                defaultValue={profile?.username || ""}
                className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email</Label>
              <Input
                id="profile-email"
                name="email"
                type="email"
                defaultValue={profile?.email || ""}
                className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-phone">Teléfono</Label>
              <Input
                id="profile-phone"
                name="phone"
                type="tel"
                defaultValue={profile?.phone || ""}
                placeholder="+54 (11) 1234-5678"
                className="h-11 rounded-2xl border-border/60 bg-background/60 px-4"
                autoComplete="tel"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-bio">Bio</Label>
            <Textarea
              id="profile-bio"
              name="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={4}
              className="rounded-2xl border-border/60 bg-background/60 px-4 py-3 text-sm"
              placeholder="Contanos sobre tu rol, intereses o enfoque actual."
              disabled={isLoading}
            />
            <p className="text-right text-xs text-muted-foreground">
              {bio.length}/160 caracteres
            </p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/40 p-5 backdrop-blur">
            <h2 className="text-sm font-medium text-foreground mb-1">
              Texto giratorio (perfil público)
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Mostrar un anillo de frases alrededor de tu avatar. Elegí un set de frases.
            </p>
            <div className="space-y-3">
              <label className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                Mostrar texto giratorio
                <Switch
                  checked={spinningTextEnabled}
                  onCheckedChange={setSpinningTextEnabled}
                  disabled={isLoading}
                />
              </label>
              {spinningTextEnabled && (
                <div className="space-y-2">
                  <Label className="text-xs">Frases</Label>
                  <Select value={spinningTextSet} onValueChange={setSpinningTextSet} disabled={isLoading}>
                    <SelectTrigger className="w-full rounded-xl border-border/60 bg-background/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(SPINNING_TEXT_SET_LABELS) as SpinningTextSetKey[]).map((key) => (
                        <SelectItem key={key} value={key}>
                          {SPINNING_TEXT_SET_LABELS[key]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/40 p-5 backdrop-blur">
            <h2 className="text-sm font-medium text-foreground">
              Notificaciones
            </h2>
            <p className="mb-4 text-xs text-muted-foreground">
              Elegí las actualizaciones que querés recibir sobre tu espacio de trabajo.
            </p>
            <div className="space-y-3">
              <label className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                Habilitar notificaciones
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  disabled={isLoading}
                />
              </label>
              <label className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                Suscribirse al newsletter
                <Switch 
                  checked={newsletter} 
                  onCheckedChange={setNewsletter}
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-border/60 bg-white/5 px-6 py-3 text-sm text-muted-foreground hover:text-primary"
              onClick={() => window.location.reload()}
              disabled={isLoading}
            >
              Resetear cambios
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-[0_20px_60px_-30px_rgba(79,70,229,0.75)] transition-transform duration-300 hover:-translate-y-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar configuración"
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
