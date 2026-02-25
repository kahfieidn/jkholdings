import { PortfolioState, Purchase } from '../types';

const INITIAL_BALANCE = 5000000000;
const STORAGE_KEY = 'jk_portfolio';

export const getPortfolio = (): PortfolioState => {
    if (typeof window === 'undefined') return { balance: INITIAL_BALANCE, purchases: [] };

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to parse portfolio', e);
        }
    }

    return { balance: INITIAL_BALANCE, purchases: [] };
};

export const savePortfolio = (state: PortfolioState) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
};

export const addPurchase = (purchase: Purchase) => {
    const current = getPortfolio();
    const newState: PortfolioState = {
        balance: current.balance - purchase.amount,
        purchases: [purchase, ...current.purchases],
    };
    savePortfolio(newState);
    return newState;
};
