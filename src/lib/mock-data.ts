import { Asset } from '../types';

export const MOCK_ASSETS: Asset[] = [
    {
        id: '1',
        name: 'Luxury Penthouse Jakarta',
        type: 'Real Estate',
        price: 5000000000,
        change: 2.5,
        description: 'Exclusive luxury penthouse in the heart of Jakarta SCBD.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: '2',
        name: 'Tech Growth Stock',
        type: 'Stocks',
        price: 1500000,
        change: -1.2,
        description: 'High-growth technology sector stocks.',
        image: 'https://images.unsplash.com/photo-1611974714851-eb604618e3d3?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: '3',
        name: 'Bitcoin (BTC)',
        type: 'Crypto',
        price: 950000000,
        change: 5.8,
        description: 'The leading cryptocurrency.',
        image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=400&q=80'
    },
    {
        id: '4',
        name: 'Pure Gold Bar',
        type: 'Gold',
        price: 1200000,
        change: 0.1,
        description: 'Physical gold investment grade 99.9%.',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80'
    }
];
