module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended'
    ],
    settings: {
        react: {
            version: 'detect',
        }
    },
    rules: {
        'padded-blocks': ['error', {
            classes: 'always',
            blocks: 'never',
            switches: 'always'
        }],
        'import/no-unresolved': 0,
        'no-console': 0,
        'no-else-return': 1,
        'no-trailing-spaces': 1,
        'class-methods-use-this': 0,
        'max-len': [2, 120],
        'indent': 0,
        'func-names': 0,
        'no-param-reassign': 0,
        'space-before-function-paren': 0,
        'lines-between-class-members': 0,
        'import/prefer-default-export': 0,
        'comma-dangle': 0,
        'no-useless-constructor': 0,
        'arrow-parens': 0,
        'arrow-body-style': 0,
        'no-void': 0,
        'no-unused-vars': 0,
        'object-curly-spacing': 2,
        'max-classes-per-file': 1,
        'import/extensions': 0,
        'import/no-extraneous-dependencies': 0,
        'react/jsx-uses-vars': 1,
        'react/prop-types': 0,
        'no-underscore-dangle': 0,
        '@typescript-eslint/no-namespace': 0,
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/no-empty-function': 1,
        '@typescript-eslint/no-empty-interface': 0,
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/no-explicit-any': 0,
        'no-dupe-class-members': 'off',
        'no-plusplus': 0,
        '@typescript-eslint/no-dupe-class-members': 'error', //
        '@typescript-eslint/no-unused-vars': ['error', {
            'vars': 'all',
            'args': 'after-used',
            'ignoreRestSiblings': false
        }],
        '@typescript-eslint/class-name-casing': ['error', {
            'allowUnderscorePrefix': true
        }],
        'comma-spacing': 'off', // handled in @typescript-eslint/comma-spacing
        '@typescript-eslint/comma-spacing': ['error', {
            'before': false,
            'after': true
        }],
        '@typescript-eslint/explicit-function-return-type': 0
    }
};
