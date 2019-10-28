const path = require('path');

module.exports = {
    entry: './34day/34day.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '34day')
    }
};