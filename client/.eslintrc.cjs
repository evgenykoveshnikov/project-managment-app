// .eslintrc.js
module.exports = {
    env: {
      browser: true, 
      es2021: true,
      node: true,
    },
    extends: [
      'eslint:recommended', 
      'plugin:react/recommended', 
      'plugin:@typescript-eslint/recommended', 
      'plugin:prettier/recommended', 
    ],
    parserOptions: {
      ecmaVersion: 'latest', 
      sourceType: 'module', 
      project: './tsconfig.json', 
      ecmaFeatures: { 
         jsx: true,
      },
    },
    parser: '@typescript-eslint/parser', 
    plugins: [
      'react', 
      '@typescript-eslint', 
      'prettier' 
    ],
    rules: {
      
    },
    settings: {
       react: {
         version: 'detect', 
       },
    },
    ignorePatterns: ['node_modules/', 'dist/', 'build/', '.eslintrc.js', '*.config.js'], 
  };