import { Asset } from '../types';

export const MOCK_ASSETS: Asset[] = [
    {
        id: '1',
        name: 'Obligasi Pemerintah FR0091',
        type: 'Obligasi',
        price: 100000000,
        change: 0.8,
        description: 'Obligasi Negara Ritel seri FR0091 dengan kupon tetap.',
        image: 'https://images.unsplash.com/photo-1611974714851-eb604618e3d3?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: '2',
        name: 'Reksa Dana Pasar Uang',
        type: 'Pasar Uang',
        price: 50000000,
        change: 0.3,
        description: 'Reksa dana pasar uang dengan likuiditas tinggi dan risiko rendah.',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: '3',
        name: 'Bitcoin (BTC)',
        type: 'Crypto',
        price: 950000000,
        change: 5.8,
        description: 'Aset kripto terbesar berdasarkan kapitalisasi pasar.',
        image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: '4',
        name: 'Saham BBRI',
        type: 'Stock',
        price: 4500,
        change: -1.2,
        description: 'Saham PT Bank Rakyat Indonesia (Persero) Tbk.',
        image: 'https://images.unsplash.com/photo-1611974714851-eb604618e3d3?auto=format&fit=crop&w=400&q=80'
    }
];
