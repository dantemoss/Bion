// Sistema de Layouts para perfiles

export type LayoutType = 'list' | 'grid' | 'bento'

export interface LayoutConfig {
  name: string
  description: string
  icon: 'list' | 'grid-2x2' | 'layout-dashboard'
}

export const layouts: Record<LayoutType, LayoutConfig> = {
  list: {
    name: 'Lista',
    description: 'Links apilados verticalmente, estilo Linktree clásico',
    icon: 'list',
  },
  grid: {
    name: 'Grilla',
    description: 'Links en cuadrícula de 2 columnas',
    icon: 'grid-2x2',
  },
  bento: {
    name: 'Bento',
    description: 'Layout asimétrico estilo bento.me con bloques de distintos tamaños',
    icon: 'layout-dashboard',
  },
}

export const defaultLayout: LayoutType = 'list'
