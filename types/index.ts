// グローバル型定義
export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
}

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

// 共通のコンポーネントProps
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}