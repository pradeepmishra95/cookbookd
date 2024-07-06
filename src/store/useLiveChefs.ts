import {create} from 'zustand';

type LiveChefType = {
  chef_id: number;
  chef_live_image: string;
  chef_name: string;
  chef_profile_image: string;
  description: string;
};

type useLiveChefsI = {
  liveChefs: LiveChefType[];
  updateLiveChefs: (newLiveChefs: LiveChefType[]) => void;
  clearLiveChefs: () => void;
};

const useLiveChefs = create<useLiveChefsI>((set, get) => ({
  // liveChefs: [
  //   {
  //     live_title: 'Chef 1',
  //     chef_name: 'Chef John',
  //     chef_id: 1,
  //     chef_profile_image:
  //       'https://www.shutterstock.com/shutterstock/photos/710598298/display_1500/stock-photo-young-male-chef-isolated-on-white-710598298.jpg',
  //     live_thumbnail_image:
  //       'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1954&q=80',
  //     live_description:
  //       'Join Chef John as he demonstrates the art of making delicious pasta dishes.',
  //   },
  //   {
  //     live_title: 'Chef 2',
  //     chef_name: 'Chef Sarah',
  //     chef_id: 2,
  //     chef_profile_image:
  //       'https://www.shutterstock.com/shutterstock/photos/710598298/display_1500/stock-photo-young-male-chef-isolated-on-white-710598298.jpg',
  //     live_thumbnail_image:
  //       'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1954&q=80',
  //     live_description:
  //       'Learn the secrets of perfect baking from Chef Sarah in this exclusive live session.',
  //   },
  //   {
  //     live_title: 'Sushi Making',
  //     chef_name: 'Chef David',
  //     chef_id: 789,
  //     chef_profile_image:
  //       'https://www.shutterstock.com/shutterstock/photos/710598298/display_1500/stock-photo-young-male-chef-isolated-on-white-710598298.jpg',
  //     live_thumbnail_image:
  //       'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1954&q=80',
  //     live_description:
  //       'Discover the art of sushi making with Chef David. Tune in to learn and enjoy!',
  //   },
  //   {
  //     live_title: 'Healthy Salads',
  //     chef_name: 'Chef Lisa',
  //     chef_id: 101,
  //     chef_profile_image:
  //       'https://www.shutterstock.com/shutterstock/photos/710598298/display_1500/stock-photo-young-male-chef-isolated-on-white-710598298.jpg',
  //     live_thumbnail_image:
  //       'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1954&q=80',
  //     live_description:
  //       'Join Chef Lisa as she creates delicious and nutritious salad recipes for a healthier lifestyle.',
  //   },
  //   {
  //     live_title: 'Dessert Delights',
  //     chef_name: 'Chef Michael',
  //     chef_id: 202,
  //     chef_profile_image:
  //       'https://www.shutterstock.com/shutterstock/photos/710598298/display_1500/stock-photo-young-male-chef-isolated-on-white-710598298.jpg',
  //     live_thumbnail_image:
  //       'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1954&q=80',
  //     live_description:
  //       'Indulge in the sweet world of desserts with Chef Michael. Learn to create delightful treats!',
  //   },
  //   {
  //     live_title: 'Grilling Extravaganza',
  //     chef_name: 'Chef Emily',
  //     chef_id: 303,
  //     chef_profile_image:
  //       'https://www.shutterstock.com/shutterstock/photos/710598298/display_1500/stock-photo-young-male-chef-isolated-on-white-710598298.jpg',
  //     live_thumbnail_image:
  //       'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1954&q=80',
  //     live_description:
  //       'Fire up the grill and join Chef Emily as she demonstrates the art of grilling various meats and vegetables.',
  //   },
  //   {
  //     live_title: 'Vegetarian Cooking',
  //     chef_name: 'Chef Kevin',
  //     chef_id: 404,
  //     chef_profile_image:
  //       'https://www.shutterstock.com/shutterstock/photos/710598298/display_1500/stock-photo-young-male-chef-isolated-on-white-710598298.jpg',
  //     live_thumbnail_image:
  //       'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1954&q=80',
  //     live_description:
  //       'Explore the world of vegetarian cooking with Chef Kevin. Learn to make tasty and wholesome plant-based meals.',
  //   },
  //   {
  //     live_title: 'Cocktail Mixology',
  //     chef_name: 'Chef Laura',
  //     chef_id: 505,
  //     chef_profile_image:
  //       'https://www.shutterstock.com/shutterstock/photos/710598298/display_1500/stock-photo-young-male-chef-isolated-on-white-710598298.jpg',
  //     live_thumbnail_image:
  //       'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1954&q=80',
  //     live_description:
  //       'Explore the world of vegetarian cooking with Chef Kevin. Learn to make tasty and wholesome plant-based meals.',
  //   },
  // ],
  liveChefs: [],
  updateLiveChefs: newLiveChefs => {
    const {liveChefs} = get();
    set({liveChefs: liveChefs.concat(newLiveChefs)});
  },
  clearLiveChefs: () => set({liveChefs: []}),
}));

export default useLiveChefs;
export type {LiveChefType, useLiveChefsI};
