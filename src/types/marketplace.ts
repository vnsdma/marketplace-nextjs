export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  seller_email: string;
  image_url: string | null;
  location: string;
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id?: string;
  listing_id: string;
  buyer_email: string;
  seller_email: string;
  message: string;
  created_at?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  iconName: string;
}

export const CATEGORIES: CategoryItem[] = [
  { id: 'all', name: 'All Categories', iconName: 'LayoutGrid' },
  { id: 'Electronics', name: 'Electronics', iconName: 'Laptop' },
  { id: 'Vehicles', name: 'Vehicles', iconName: 'Car' },
  { id: 'Home Goods', name: 'Home Goods', iconName: 'Home' },
  { id: 'Apparel', name: 'Apparel & Clothing', iconName: 'Shirt' },
  { id: 'Hobbies', name: 'Hobbies & Sports', iconName: 'Bike' },
  { id: 'Entertainment', name: 'Entertainment & Media', iconName: 'Gamepad2' },
  { id: 'Garden & Outdoor', name: 'Garden & Outdoor', iconName: 'Flower2' },
  { id: 'Property Rentals', name: 'Property Rentals', iconName: 'Building' },
  { id: 'Free Stuff', name: 'Free Stuff', iconName: 'Gift' },
];
