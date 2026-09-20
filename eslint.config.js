const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier/flat");
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { "react-native": reactNativePlugin },
    rules: {
      "react-native/no-unused-styles": "warn",
    },
  },
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*"],
  },
]);
