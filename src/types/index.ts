export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
}

export type AssetType = 'Obligasi' | 'Pasar Uang' | 'Crypto' | 'Stock';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  price: number;
  change: number; // percentage change
  description: string;
  image: string;
}

export interface Purchase {
  id: string;
  userId: string;
  assetId: string;
  amount: number;
  purchaseDate: string;
  status: 'Pending' | 'Completed';
}
