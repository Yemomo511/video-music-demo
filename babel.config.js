module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json','.mp4'],
        alias: {
          '~component/*': ['./src/components/*'],
          '~assets/*':['./src/assets/*'],
          "~screen/*":['./src/screen/*'],
          "~image/*":['./src/image/*']
        },
      },
    ],
    [
      "import",
      {
        libraryName:"@ant-design/react-native", 
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
