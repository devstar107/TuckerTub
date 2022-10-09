import type { HTMLAttributes, ReactNode } from 'react'

import type { Product } from './WooCommerce'

export * from './WooCommerce'
export * from './global'

export interface WrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export interface ProductProps {
  products: Product[]
}

export interface ArticleProps {
  articles: any[]
  featuredMedia?: any
}

export interface IInfoCard extends HTMLAttributes<HTMLDivElement> {
  heading: string
  subheading: string
  description: string | ReactNode
  icon: ReactNode
}

export interface IChecklist {
  id: string
  title: string
}

export interface Slider {
  id: number
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
}
