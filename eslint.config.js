import antfu from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
    },
    typescript: true,
    rules: {
        'curly': ['error', 'multi-line'],
        'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'n/prefer-global/buffer': 'off',
        'style/quotes': ['error', 'single', { avoidEscape: true }],
        'test/consistent-test-it': 'off',
        'import/order': ['error', { 'newlines-between': 'always' }],
        'antfu/if-newline': 'off',
        'style/max-statements-per-line': ['error', { max: 2 }],
        'no-console': 'off',
        'unused-imports/no-unused-vars': 'off',
    },
})
