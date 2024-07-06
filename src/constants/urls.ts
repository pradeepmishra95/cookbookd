 const urls = {
  no_auth: {
    common: {},
    chef: {
      login: '/chef/login',
      registration: '/chef/signup',
      forgot_password: {
        send_otp: '/forgot/password/chef',
        verify_otp: '/verify/forgot/password/chef',
        change_password: '/change/password/chef',
      },
    },
    customer: {
      login: '/customer/login',
      registration: '/customer/signup',
      forgot_password: {
        send_otp: '/forgot/password/customer',
        verify_otp: '/verify/forgot/password/customer',
        change_password: '/change/password/customer',
      },
    },
  },
  auth: {
    common: {
      chef_profile: '/get/chef/profile/page',
      address: {
        update: '/update/address',
        delete: '/delete/address',
        chef: {get: '/get/address/chef', add: '/add/address/chef'},
        customer: {get: '/get/address/customer', add: '/add/address/customer'},
        address_from_coordinates: '/get/address/coordinates',
      },
      constants: {
        country: '/get/contry/names',
        states: '/get/state/names',
        city: '/get/city/names',
        category: '/get/constants/category',
        cuisine: '/get/constants/cuisine',
        account_type: '/get/account/type',
      },
      support_center: '/support/center',
      register_token: '/add/device/token',
      comments: {
        get_post_comments: '/get/post/comments',
      },
      google_geo_data: 'https://maps.googleapis.com/maps/api/geocode/json',
      report: '/report',
      post: {
        save: '/save/post',
        get:'/get/saved/post',
      },
    },
    chef: {
      logout: '/chef/logout/',
      live: {
        go_live: '/go/live/chef',
        join_live: '/join/live/chef',
      },
      menu: {
        add: '/add/menu/chef',
        get: '/get/menu/chef',
        update: '/update/menu/chef',
        delete: '/delete/menu/chef',
      },
      verification: {
        send_otp: '/generate/verification/code/chef',
        verify_otp: '/chef/verification',
      },
      availability: {
        add: '/add/chef/availability',
        get: '/get/chef/availability',
      },
      bank_account: {
        add: '/add/chef/bank/details',
      },
      profile: {get: '/get/profile/chef', update: '/update/profile/chef'},
      guidelines: '/get/cms/page/CHEF_GUIDELINES',
      terms_and_condition: '/get/cms/page/CHEF_TERMS_AND_CONDITIONS',
      followers: {
        get: '/get/followers',
      },
      rating: {
        get: '/get/rating',
      },
      posts: {
        get: '/get/post/chef',
        add: '/create/post',
        update: '/update/post',
        like: '/chef/like/post',
        delete: '/delete/post',
      },
      comment: {
        add: '/chef/add/comment',
        like: '/chef/like/comment',
      },
      notification: {
        get: '/get/all/chef/notifications',
      },
    },
    customer: {
      search: '/customer/search',
      logout: '/customer/logout/',
      menu: {
        get: '/get/menu/customer/',
      },
      verification: {
        send_otp: '/generate/verification/code/customer',
        verify_otp: '/customer/verification',
      },
      profile: {
        get: '/get/profile/customer',
        update: '/update/profile/customer',
      },
      guidelines: '/get/cms/page/CUSTOMER_GUIDELINES',
      terms_and_condition: '/get/cms/page/CUSTOMER_TERMS_AND_CONDITIONS',
      comment: {
        add: '/customer/add/comment',
        like: '/customer/like/comment',
      },
      posts: {
        get: '/get/post/customer',
        like: '/customer/like/post',
      },
      favorites: {
        get_ids: '/get/favotires/ids',
        get: '/get/favotires',
        add: '/make/favotires',
        delete: '/remove/favotires',
      },
      chef: {
        get: '/get/chefs',
        follow: '/add/new/follower',
      },
      notification: {
        get: '/get/all/customer/notifications',
      },
    },
  },
};

export default urls;
