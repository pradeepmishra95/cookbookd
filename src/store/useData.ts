import {PostType} from '@/components/Post';
import {create} from 'zustand';

export type FavoriteType = 'chef' | 'menu';

type useDataI = {
  posts: Record<string, PostType[]>;
  notificationCount: number;
  chatCount: number;
  favorites: Record<FavoriteType, Set<number>>;

  getPosts: (key: string) => PostType[];
  setPosts: (key: string, posts: PostType[]) => void;
  postAction: (
    action: 'like' | 'comment' | 'save',
    key: string,
    index: number,
  ) => void;
  // addComment: (index: number) => void;
  // likePost: (key: string; index: number) => void;
  updateCount: (type: 'notification' | 'chat', count: number) => void;
  toggleFavorites: (type: FavoriteType, id: number) => void;
  addFavorites: (type: FavoriteType, id: number) => void;
};

const useData = create<useDataI>((set, get) => ({
  posts: {},
  notificationCount: 0,
  chatCount: 0,
  favorites: {menu: new Set(), chef: new Set()},

  getPosts: key => {
    const {posts} = get();
    return posts[key] ?? [];
  },
  setPosts: (key, posts) => {
    set(prev => ({posts: {...prev.posts, [key]: posts}}));
  },
  postAction: (action, key, index) => {
    const {posts} = get();
    const prevData = posts[key][index];

    switch (action) {
      case 'like': {
        prevData.total_likes = prevData.is_liked
          ? prevData.total_likes - 1
          : prevData.total_likes + 1;
        prevData.is_liked = !prevData.is_liked;
        posts[key].splice(index, 1, prevData);
        break;
      }
      case 'comment': {
        prevData.total_comments += 1;
        posts[key].splice(index, 1, prevData);
        break;
      }
      case 'save': {
        prevData.is_saved = !prevData.is_saved;
        posts[key].splice(index, 1, prevData);
        break;
      }
    }
    set({posts: {...posts}});
  },
  updateCount: (type, count) => {
    switch (type) {
      case 'notification':
        set({notificationCount: count});
        break;
      case 'chat':
        set({chatCount: count});
        break;
    }
  },
  toggleFavorites: (type, id) => {
    const {favorites} = get();
    const favoritesSet = favorites[type];
    if (!favoritesSet.has(id)) favoritesSet.add(id);
    else favoritesSet.delete(id);
    set({favorites: {...favorites, [type]: new Set(favoritesSet)}});
  },
  addFavorites: (type, id) => {
    const {favorites} = get();
    const favoritesSet = favorites[type];
    favoritesSet.add(id);
    set({favorites: {...favorites, [type]: new Set(favoritesSet)}});
  },
}));

export type {useDataI};

export default useData;
