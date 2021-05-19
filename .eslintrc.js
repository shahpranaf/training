module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'linebreak-style': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'max-len': 'off',
    'label-has-associted-control': 'off',
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'no-restricted-syntax': 0,
    'consistent-return': 0,
    'guard-for-in': 0,
    'anchor-is-valid': 0,
    'jsx-a11y/anchor-is-valid': 0,
    eqeqeq: 0,
    'array-callback-return': 0,
    'no-shadow': 0,
    'jsx-a11y/control-has-associated-label': 0,
    'react/destructuring-assignment': 0,
    'react/prop-types': 0,
    'import/no-extraneous-dependencies': 0,
    'no-console': 0,
    'no-param-reassign': 0,
  },
};
