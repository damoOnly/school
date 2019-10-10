const path = require('path');

module.exports = {
    entry: './31day/31day.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '31day')
    }
};