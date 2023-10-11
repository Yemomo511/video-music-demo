module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // 配置 babel-plugin-module-resolver
    [
      require.resolve('babel-plugin-module-resolver'),
      {
        root: ['.'],
        alias: {
          '@': ['./src'],
          '@assets': './src/assets',
          '@components': './src/Components',
          '@Screen': './src/Screen',
        },
      },
    ],
  ],
};
