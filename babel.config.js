module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    require.resolve('nativewind/babel'),
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['.'],
        alias: {
          '^@/(.+)': './src/\\1',
        },
      },
    ],
    require.resolve('react-native-reanimated/plugin'),
  ],
};
