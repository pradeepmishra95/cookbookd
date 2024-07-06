import {create} from 'zustand';

type useCacheI = {
  cache: Record<string, any>;
  setCache: <T>(key: string, data: T) => void;
  getCache: <T>(key: string) => T | null;
  clearCache: () => void;
};

const useCache = create<useCacheI>((set, get) => ({
  cache: {},
  setCache: (key, data) => {
    const {cache} = get();
    cache[key] = data;
    set({cache});
  },
  getCache: key => {
    const {cache} = get();
    return cache[key] ?? null;
  },
  clearCache: () => set({cache: {}}),
}));

export default useCache;
export type {useCacheI};
