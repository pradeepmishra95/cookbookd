const onboardingScreens = [
  {
    image: require('@/assets/images/onboarding/1.png'),
    title: 'Enjoy Your Favorite Chef In Private',
    description: 'Book A Chef To Display Their Culinary Skills In Your Home',
  },
  {
    image: require('@/assets/images/onboarding/2.png'),
    title: 'Discover Delicious Home-Cooked Meals',
    description:
      'Find the best home-cooked meals in your area, made by local home chefs who are passionate about cooking.',
  },
  {
    image: require('@/assets/images/onboarding/3.png'),
    title: 'Join the CookBookd Community',
    description:
      'Turn your passion for cooking into a business by becoming a home chef. Offer your delicious dishes to people in your area and make money doing what you love.',
  },
];

const ANIMATION_DURATION = 4500;
const PILL_HEIGHT = 5;
const PILL_WIDTH = 12;

export default onboardingScreens;
export {ANIMATION_DURATION, PILL_HEIGHT, PILL_WIDTH};
