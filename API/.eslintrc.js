'use strict';

module.exports = {
    'extends': 'google',
    'parserOptions': {
        'ecmaVersion': 7,
    },
    'env': {
        'es6': true,
        // 'shared-node-browser': true,
        'node': true,
        'browser': true,
    },
    'globals': {
        'module': false,
    },
    'rules': {
        'max-len': 'off',
        'new-cap': 'off',
        'object-curly-spacing': ['error', 'always'],
        'indent': ['error', 4],
    },
};
