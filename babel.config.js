module.exports = function(api) {

  plugins: [
    'react-native-reanimated/plugin', // Reanimated plugin has to be listed last.
  ],


  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
