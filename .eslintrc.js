module.exports = {
  root: true,
  extends: ['@react-native'],
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    'coverage/',
    'dist/',
    'build/',
    '.husky/',
  ],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {jsx: true},
      },
      rules: {
        // TypeScript strictness (aligns with tsconfig strict: true)
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/consistent-type-imports': [
          'warn',
          {prefer: 'type-imports', fixStyle: 'inline-type-imports'},
        ],
        '@typescript-eslint/no-non-null-assertion': 'warn',
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            'ts-expect-error': 'allow-with-description',
            'ts-ignore': true,
            'ts-nocheck': true,
          },
        ],
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-shadow': 'error',
        'no-shadow': 'off',

        // React / hooks
        'react-hooks/exhaustive-deps': 'error',
        'react-hooks/rules-of-hooks': 'error',

        // Quality
        'no-console': ['warn', {allow: ['warn', 'error']}],
        'no-void': 'off',
        eqeqeq: ['error', 'always', {null: 'ignore'}],
      },
    },
    {
      files: [
        '**/*.{spec,test}.{ts,tsx}',
        '**/__tests__/**/*.{ts,tsx}',
        '**/__mocks__/**/*.{ts,tsx}',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
};
