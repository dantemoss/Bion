import { z } from "zod"

/**
 * Schema de validación para crear/actualizar bloques
 * Protege contra inyección de código, XSS y datos maliciosos
 */
export const blockSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder 100 caracteres")
    .trim()
    .refine(
      (val) => {
        // Sanitizar: remover caracteres peligrosos para prevenir XSS
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i, // onclick, onerror, etc.
          /<iframe/i,
          /<object/i,
          /<embed/i,
        ]
        return !dangerousPatterns.some((pattern) => pattern.test(val))
      },
      {
        message: "El título contiene caracteres no permitidos",
      }
    ),
  url: z
    .string()
    .max(2048, "La URL no puede exceder 2048 caracteres")
    .refine(
      (val) => {
        // Si es header, la URL puede estar vacía
        if (!val || val.trim() === "") return true
        
        // Validar formato de URL
        try {
          const url = new URL(val)
          // Solo permitir http/https
          if (!["http:", "https:"].includes(url.protocol)) {
            return false
          }
          // Prevenir javascript:, data:, etc.
          if (url.protocol === "javascript:" || url.protocol === "data:") {
            return false
          }
          return true
        } catch {
          return false
        }
      },
      {
        message: "La URL debe ser válida y usar http:// o https://",
      }
    )
    .optional()
    .or(z.literal("")),
  type: z.enum(
    [
      "link",
      "header",
      "youtube",
      "github",
      "spotify",
      "instagram",
      "twitter",
      "tiktok",
      "linkedin",
      "discord",
      "twitch",
      "facebook",
      "whatsapp",
      "telegram",
      "dribbble",
      "behance",
      "figma",
      "notion",
      "medium",
      "substack",
      "patreon",
      "buymeacoffee",
      "reddit",
      "bluesky",
      "threads",
      "snapchat",
      "pinterest",
      "vimeo",
      "soundcloud",
      "bandcamp",
      "applemusic",
      "deezer",
      "tidal",
      "mastodon",
      "producthunt",
      "stackoverflow",
      "codepen",
      "gitlab",
      "bitbucket",
      "devto",
      "hashnode",
      "polywork",
      "linktree",
      "beacons",
      "carrd",
      "kofi",
      "gumroad",
      "etsy",
      "shopify",
      "kickstarter",
      "indiegogo",
      "onlyfans",
      "fansly",
      "twilio",
      "slack",
      "zoom",
      "calendly",
      "cal",
    ]
  ).refine(
    (val) => val !== undefined,
    {
      message: "Tipo de bloque no válido",
    }
  ),
})

/**
 * Schema para validar IDs de bloques (UUIDs)
 */
export const blockIdSchema = z.string().uuid("ID de bloque no válido")

/**
 * Schema para validar arrays de IDs en reordenamiento
 */
export const reorderBlocksSchema = z
  .array(z.string().uuid())
  .min(1, "Debe haber al menos un bloque")
  .max(100, "No se pueden reordenar más de 100 bloques a la vez")

/**
 * Función helper para sanitizar strings y prevenir XSS
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remover < y >
    .replace(/javascript:/gi, "") // Remover javascript:
    .replace(/on\w+\s*=/gi, "") // Remover event handlers
    .slice(0, 100) // Limitar longitud
}

/**
 * Función helper para validar y sanitizar URLs
 */
export function sanitizeUrl(url: string | null | undefined): string | null {
  if (!url || url.trim() === "") return null

  try {
    const parsedUrl = new URL(url.trim())
    
    // Solo permitir http/https
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return null
    }

    // Prevenir protocolos peligrosos
    const dangerousProtocols = ["javascript:", "data:", "vbscript:", "file:"]
    if (dangerousProtocols.some((p) => parsedUrl.href.toLowerCase().startsWith(p))) {
      return null
    }

    // Limitar longitud
    if (parsedUrl.href.length > 2048) {
      return null
    }

    return parsedUrl.href
  } catch {
    return null
  }
}

/**
 * Schema de validación para actualizar perfil de usuario
 */
export const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, "El nombre completo es requerido")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .trim()
    .refine(
      (val) => {
        // Sanitizar: remover caracteres peligrosos
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /<iframe/i,
        ]
        return !dangerousPatterns.some((pattern) => pattern.test(val))
      },
      {
        message: "El nombre contiene caracteres no permitidos",
      }
    ),
  username: z
    .string()
    .min(3, "El username debe tener al menos 3 caracteres")
    .max(30, "El username no puede exceder 30 caracteres")
    .trim()
    .toLowerCase()
    .refine(
      (val) => /^[a-z0-9_-]+$/.test(val),
      {
        message: "El username solo puede contener letras minúsculas, números, guiones y guiones bajos",
      }
    ),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "El email no puede exceder 255 caracteres")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(20, "El teléfono no puede exceder 20 caracteres")
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true
        // Permitir números, espacios, paréntesis, guiones y el símbolo +
        return /^[\d\s()+-]+$/.test(val)
      },
      {
        message: "El teléfono contiene caracteres no permitidos",
      }
    )
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(160, "La bio no puede exceder 160 caracteres")
    .refine(
      (val) => {
        // Sanitizar: remover caracteres peligrosos
        const dangerousPatterns = [
          /<script/i,
          /javascript:/i,
          /on\w+\s*=/i,
        ]
        return !dangerousPatterns.some((pattern) => pattern.test(val))
      },
      {
        message: "La bio contiene caracteres no permitidos",
      }
    )
    .optional()
    .or(z.literal("")),
  notifications_enabled: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean()),
  newsletter_enabled: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean()),
  spinning_text_enabled: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean()),
  spinning_text_set: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "" || val == null ? null : val))
    .refine(
      (val) =>
        val === null ||
        ["exclusive", "aesthetic", "fashion", "premium", "limited", "rare"].includes(val),
      { message: "Palabra inválida" }
    ),
  avatar_position: z.preprocess(
    (val) => (val === "" || val == null ? null : val),
    z.union([
      z.null(),
      z.string()
        .max(30)
        .regex(/^\d+%\s+\d+%$/, { message: "Formato inválido (ej: 50% 50%)" }),
    ])
  ),
})

/**
 * Schema de validación para archivos de imagen
 */
export const imageFileSchema = z.object({
  size: z
    .number()
    .max(5 * 1024 * 1024, "La imagen no puede superar los 5MB"),
  type: z
    .string()
    .refine(
      (val) => val.startsWith("image/"),
      {
        message: "El archivo debe ser una imagen",
      }
    ),
})

/**
 * Función helper para sanitizar nombres de archivo
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "_") // Reemplazar caracteres especiales
    .slice(0, 255) // Limitar longitud
}
