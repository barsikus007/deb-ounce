module.exports = {
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'airbnb',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  plugins: [
    'react-refresh',
    'react',
    '@typescript-eslint',
  ],
  rules: {
    // tsx import fixes
    '@typescript-eslint/ban-ts-comment': 'warn', // typescript moment
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }], // JSX fix
    'import/extensions': ['off', 'ignorePackages', { ts: 'never', tsx: 'never' }], // .tsx extension fix

    // fix vite /public to / mapping
    'import/no-unresolved': ['error', { ignore: ['^/.*'] }],
    'import/no-absolute-path': 'off',

    // other fixes
    'import/no-extraneous-dependencies': ['off'], // @tanstack/react-virtual
    'react-refresh/only-export-components': 'warn', // vite initial rule
    'react/prop-types': ['warn', { skipUndeclared: true }], // skip props validation error
    // TODO test 'react/jsx-uses-react': 'off', // plugin:react/jsx-runtime wont work in vscode
    'react/react-in-jsx-scope': 'off', // plugin:react/jsx-runtime wont work in vscode
    'react/jsx-props-no-spreading': 'off', // spreading is useful
    'jsx-a11y/label-has-associated-control': 'off', // turned off due to modern label syntax wont work
    'arrow-parens': ['error', 'as-needed'], // e => { e.doSmth() }
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
