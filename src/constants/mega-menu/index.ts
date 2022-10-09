export interface IMegaMenuItem {
  id: number
  title: string
  slug: string
  imageUrl: string
}

export const megaMenuItems: IMegaMenuItem[] = [
  {
    id: 1,
    title: 'Cooked Food',
    slug: 'cooked-food',
    imageUrl: '/assets/images/cooked-food.svg'
  },
  {
    id: 2,
    title: 'Raw Food',
    slug: 'raw-food',
    imageUrl: '/assets/images/raw-food.svg'
  },
  {
    id: 3,
    title: 'Dry Food',
    slug: 'dry-food',
    imageUrl: '/assets/images/dry-food.svg'
  },
  {
    id: 4,
    title: 'Treats',
    slug: 'treats',
    imageUrl: '/assets/images/treats.svg'
  }
]
