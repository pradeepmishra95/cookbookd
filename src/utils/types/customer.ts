import { SelectOptions } from '@/components/Select';

export type CuisinesType = {
  id: number;
  fullname: string;
  profile_image: string;
  average_rating: number;
  total_ratings: number;
  distance: number;
  status: number;
  title: string;
  menu_images: { image: string; id: number }[];
  image: string;
} & SelectOptions;




type PostMediaCommonType = {
  id: number;
  path: string;
};

type PostMediaImageType = {
  is_video: 0;
  thumbnail?: never;
};

type PostMediaVideoType = {
  is_video: 1;
  thumbnail: string;
};

type PostMediaType =
  | (PostMediaCommonType & PostMediaImageType)
  | (PostMediaCommonType & PostMediaVideoType);

export type SavedPostCardType = {
    id: number;
    chef_id: number;
    description: string;
    created_at: string;
    posts_media: PostMediaType[];
    total_likes: number;
    total_comments: number;
    chef_name: string;
    chef_profile_image: string;
    total_ratings: number;
    total_avarage_rating: number;
    is_liked: boolean;
    is_saved: boolean;}

export type FoodType = {
  id: number;
  fullname: string;
  profile_image: string;
  average_rating: number;
  total_ratings: number;
  distance: number;
  status: number;
  title: string;
  menu_images: { image: string; id: number }[];
};

export type ChefType = {
  id: number;
  fullname: string;
  profile_image: string;
  average_rating: number;
  total_ratings: number;
  distance: number;
  status: 0 | 1;
};

