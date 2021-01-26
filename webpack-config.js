const path = require("path");

module.exports = {
    devtool: 'source-map',
    entry: {
        main: "./src/main.tsx",
        "pdf.worker": "pdfjs-dist/build/pdf.worker.entry"
    },
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'public/'),
        filename: "[name].bundle.js",
    },
    resolve: {
        extensions: ['.Webpack.js', '.web.js', '.ts', '.js', '.jsx', '.tsx']
    },
    module: {
        rules: [{
                test: /\.tsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.css/,
                use: [
                    'css-loader',
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)/,
                use: {
                    loader: 'file-loader?name=[path][name].[ext]'
                }
            },
        ]
    }
}