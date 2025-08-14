module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error'
  }
}
