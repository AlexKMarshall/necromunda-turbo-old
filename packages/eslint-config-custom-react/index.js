module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'turbo',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  // overrides: [
  //   {
  //     files: ['**/__tests__/**/*'],
  //     env: {
  //       jest: true,
  //       jsdom: true,
  //     },
  //   },
  // ],
}
