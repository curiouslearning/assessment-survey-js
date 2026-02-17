const path = require('path');

module.exports = {
    entry: './src/AssessmentElement.ts',
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'assessment-webcomponent.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'AssessmentSurvey',
            type: 'umd',
            export: 'default',
        },
        globalObject: 'this',
    },
    optimization: {
        minimize: true,
    },
};
