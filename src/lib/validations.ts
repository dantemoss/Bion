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
