import AccountSVG from '@/assets/icons/bottom_tab/account.svg';
import FavoritesSVG from '@/assets/icons/bottom_tab/favorites.svg';
import HomeSVG from '@/assets/icons/bottom_tab/home.svg';
import OrdersSVG from '@/assets/icons/bottom_tab/orders.svg';
import MenuSVG from '@/assets/icons/bottom_tab/receipt.svg';
import {ChefBottomTabParamListType} from '@/routes/auth/chef/types';
import {CustomerBottomTabParamListType} from '@/routes/auth/customer/types';
import {FC} from 'react';
import {SvgProps} from 'react-native-svg';

const bottomTabData: {
  customer: {
    [key in keyof CustomerBottomTabParamListType]: {
      title: string;
      icon: FC<SvgProps>;
    };
  };
  chef: {
    [key in keyof ChefBottomTabParamListType]: {
      title: string;
      icon: FC<SvgProps>;
    };
  };
} = {
  customer: {
    home: {
      title: 'Home',
      icon: HomeSVG,
    },
    orders: {
      title: 'Orders',
      icon: OrdersSVG,
    },
    favorites: {
      title: 'Favorites',
      icon: FavoritesSVG,
    },
    account: {
      title: 'Account',
      icon: AccountSVG,
    },
  },
  chef: {
    home: {
      title: 'Home',
      icon: HomeSVG,
    },
    orders: {
      title: 'Orders',
      icon: OrdersSVG,
    },
    menu: {
      title: 'Menu',
      icon: MenuSVG,
    },
    account: {
      title: 'Account',
      icon: AccountSVG,
    },
  },
};

export default bottomTabData;
