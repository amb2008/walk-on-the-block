module.exports = function (api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Required for Expo Router
      // "expo-router/babel",

      // Loads variables from .env files
      [
        "babel-plugin-dotenv-import",
        {
          moduleName: "@env",
          path: ".env",
          allowUndefined: false,
        },
      ],
    ],
  };
};
