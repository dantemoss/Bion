# PublicBentoGrid - Rich Media Profile

## Descripción General

`PublicBentoGrid` es un componente avanzado que transforma el perfil público de MyBento en un "Dashboard de Mando" visual utilizando **MagicUI Bento Grid**. Este componente renderiza bloques con representaciones visuales específicas según el tipo de contenido.

## Características Principales

### 📺 Renderizado Polimórfico

El componente detecta automáticamente el tipo de contenido y aplica una visualización específica:

#### 1. **YouTube Videos**
- Extrae el ID del video de la URL (soporta formatos estándar y shorts)
- Muestra la thumbnail en alta resolución (maxresdefault)
- Overlay con gradiente negro y botón de reproducción prominente
- Efecto hover en el botón de play

#### 2. **Spotify**
- Detecta tracks, albums, playlists y artistas
- Renderiza un iframe embed nativo de Spotify
- Permite reproducción directa en el perfil
- Responsive y con bordes redondeados

#### 3. **Twitter/X**
- Extrae el ID del tweet de la URL
- Estilo "Quote" con gradiente azul/cyan
- Ícono de mensaje gigante de fondo (semi-transparente)
- CTA para leer el tweet completo

#### 4. **Mapas**
- Detecta Google Maps URLs
- Renderiza iframe embed de Google Maps (si disponible)
- Fallback a visualización estilizada con ícono de ubicación

#### 5. **Header Card** (Perfil/Identidad)
- Se muestra automáticamente cuando hay más de 3 bloques
- Ocupa ancho completo (col-span-3)
- Avatar grande del usuario + nombre + bio
- Gradiente de fondo con globo terráqueo animado

#### 6. **Links Estándar** (Default)
- Detecta la plataforma usando `detectPlatform()`
- Muestra el ícono de marca de fondo (semi-transparente)
- Ícono de marca prominente o ExternalLink genérico
- Soporte para `is_highlighted` con efecto de brillo dorado

## Layout Dinámico

### Highlight System
- `is_highlighted: true` → Tarjeta ocupa 2 columnas en desktop (`md:col-span-2`)
- `is_highlighted: false` → Tarjeta ocupa 1 columna (`col-span-1`)
- Los bloques destacados tienen un anillo dorado y sombra brillante

### Grid Responsivo
```tsx
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
```
- **Mobile**: 1 columna
- **Tablet**: 2 columnas
- **Desktop**: 3 columnas

### Altura Fija
- Todas las tarjetas tienen `auto-rows-[20rem]` (320px)
- Contenido overflow está manejado correctamente
- Bordes redondeados (`rounded-xl`)

## Funciones de Extracción

### `extractYouTubeId(url: string): string | null`
Extrae el ID de un video de YouTube desde múltiples formatos:
- `youtube.com/watch?v=ID`
- `youtu.be/ID`
- `youtube.com/embed/ID`
- `youtube.com/shorts/ID`

### `extractSpotifyId(url: string): { type: string; id: string } | null`
Extrae el tipo (track/album/playlist/artist) y el ID de Spotify:
- Retorna `{ type: 'track', id: '...' }`
- Se usa para construir la URL del embed

### `extractTweetId(url: string): string | null`
Extrae el ID de un tweet desde URLs de Twitter o X:
- Soporta tanto `twitter.com` como `x.com`

## Integración

### En `[username]/page.tsx`
```tsx
import { PublicBentoGrid } from "@/components/public-profile/public-bento-grid";

// En el componente
<PublicBentoGrid blocks={activeBlocks} profile={profile} />
```

### Props
```tsx
interface PublicBentoGridProps {
  blocks: Block[];    // Bloques activos del usuario
  profile: Profile;   // Perfil del usuario
}
```

## Componentes Card

Cada tipo de contenido tiene su propio componente interno:

- `YouTubeCard` - Videos de YouTube
- `SpotifyCard` - Música de Spotify
- `TwitterCard` - Tweets de X/Twitter
- `MapCard` - Ubicaciones y mapas
- `HeaderCard` - Perfil del usuario
- `DefaultLinkCard` - Links genéricos (fallback)

Todos usan el componente base `BentoCard` de MagicUI con props customizadas.

## Detección de Tipo

El componente usa múltiples estrategias para detectar el tipo:

1. **`block.type`** (explícito): `'youtube'`, `'spotify'`, etc.
2. **URL pattern matching**: `url.includes('youtube.com')`
3. **`detectPlatform(url)`** (fallback para links genéricos)

## Efectos Visuales

### Backgrounds
- **YouTube**: Thumbnail con gradiente negro
- **Spotify**: Iframe transparente
- **Twitter**: Gradiente azul/cyan con ícono gigante
- **Maps**: Iframe de Google Maps o gradiente verde/azul
- **Header**: Gradiente purple/pink/blue con globo animado
- **Default**: Gradiente gris con ícono de marca semi-transparente

### Hover Effects
- Todos los cards tienen `group-hover` effects de MagicUI
- El CTA se desliza hacia arriba en desktop
- Overlay sutil negro/gris en hover

### Highlighted Cards
```tsx
block.is_highlighted && "ring-2 ring-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.4)]"
```

## Notas de Diseño

1. **Dashboard de Mando**: El diseño se siente como un panel de control profesional
2. **Espaciado Consistente**: `gap-4` entre todas las tarjetas
3. **Bordes Redondeados**: Todos los iframes y backgrounds usan `rounded-lg` o `rounded-xl`
4. **Overflow Manejado**: Los iframes nunca sobresalen de sus containers
5. **Responsive**: Todo funciona en mobile, tablet y desktop
6. **Dark Mode**: Optimizado para `bg-zinc-950` del perfil público

## Próximas Mejoras Posibles

- [ ] Integración con `react-tweet` para embeds nativos de Twitter
- [ ] Animaciones de entrada para cada tarjeta (stagger effect)
- [ ] Lazy loading para iframes (performance)
- [ ] Soporte para más plataformas (Vimeo, SoundCloud, etc.)
- [ ] Vista previa de Open Graph para links genéricos
- [ ] Modo de edición drag-and-drop en el perfil público (admin only)
