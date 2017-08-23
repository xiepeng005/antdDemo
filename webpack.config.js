//引用
let webpack = require("webpack");
let path = require('path');
let glob = require('glob');
let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
let ExtractTextPlugin = require("extract-text-webpack-plugin");
let HtmlWebpackPlugin = require('html-webpack-plugin'); //html模板生成器
let CleanPlugin = require('clean-webpack-plugin'); // 文件夹清除工具
let CopyWebpackPlugin = require('copy-webpack-plugin'); // 文件拷贝
/*private*/
let srcDir = path.resolve(process.cwd(), 'src');
let pathMap = require('./src/pathmap.json');
let entries = function () {
    let jsDir = path.resolve(srcDir, 'js');
    let entryFiles = glob.sync(jsDir + '/!*.{js, jsx}');
    let map = {};
    for(let i= 0; i < entryFiles.length; i++){
        let filepath = entryFiles[i];
        let filename = filepath.substring(filepath.lastIndexOf('\/') + 1, filepath.lastIndexOf('.'));
        map[filename] = filepath;
    }
    return map;
};
/*let html_plugins = function () {
    let entryHtml = glob.sync(srcDir + '/!*.html');
    let r = [];
    let entriesFiles = entries();
    for (let i = 0; i < entryHtml.length; i++) {
        let filePath = entryHtml[i];
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        let conf = {
            template: 'html!' + filePath,
            filename: filename + '.html'
        };
        //如果和入口js文件同名
        if (filename in entriesFiles) {
            conf.inject = 'body';
            conf.chunks = ['vendor', filename]
        }
        //跨页面引用，如pageA,pageB 共同引用了common-a-b.js，那么可以在这单独处理
        //if(pageA|pageB.test(filename)) conf.chunks.splice(1,0,'common-a-b')
        r.push(new HtmlWebpackPlugin(conf))
    }
    return r
};*/
let plugins = [];
let extractCSS = new ExtractTextPlugin('css/[name].css');
let cssLoader = extractCSS.extract(['css-loader']);
let lessLoader = extractCSS.extract(['css!less']);


//全局配置加载
plugins.push(new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
}));
// 清空dist文件夹
//plugins.push(new CleanPlugin(['dist']));
// 将公共模块提取，生成名为`commons`的chunk
plugins.push(new CommonsChunkPlugin({
    name: 'commons',
    minChunks: 3
}));
//提取CSS行内样式，转化为link引入
plugins.push(extractCSS);
// js压缩
plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
    }
}));
//拷贝图片
plugins.push(new CopyWebpackPlugin([
    {from: './src/images', to: './images'}
]));
let config = {
    entry: Object.assign( entries() ,{
        index: './src/index.js',
        login: './src/login.js'
    }),
    output: {
        path: path.join(__dirname, "dist"),
        filename: "js/[name].js",
        chunkFilename: 'is/[chunkhash:8].js',
        publicPath: "/"
    },
    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                loader: "babel-loader",
                include: /src/,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015','react']
                }
            },
            {
                test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
                loaders: [
                    //小于10KB的图片会自动转成dataUrl，
                    'url?limit=10000&name=imgs/[hash:8].[name].[ext]',
                    'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
                ],
                include:/src\/imgs/
            },
            {
                test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
                loader: 'url?limit=10000&name=fonts/[hash:8].[name].[ext]'
            },
            {test: /\.css$/, loader: cssLoader},
            {test: /\.less/, loader: lessLoader}
        ]
    },
    resolve: {
        extensions: ['.js', '.css', '.less']
    },
    plugins: plugins,
    externals: {
        $: 'jQuery'
    },
    //devtool: '#source-map',
    //使用webpack-dev-server服务器，提高开发效率
    devServer: {
        // contentBase: './',
        host: 'localhost',
        port: 8188, //端口
        inline: true,
        hot: false,
    }
};
module.exports = config;
/*
let pages = Object.keys(getEntry('./src/!*.html'));
let confTitle = [
    {name: 'index', title: '这是首页标题'},
    {name: 'list', title: '这是列表标题'},
    {name: 'about', title: '这是关于我标题'}
];
//生成HTML模板
pages.forEach(function(pathname) {
    let itemName  = pathname.split('src\\') ;//根据系统路径来取文件名，window下的做法//,其它系统另测
    let conf = {
        filename: itemName[1] + '.html', //生成的html存放路径，相对于path
        template: pathname + '.html', //html模板路径
        inject: true, //允许插件修改哪些内容，包括head与body
        hash: false, //是否添加hash值
        minify: { //压缩HTML文件
            removeComments: true,//移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
        }
    };
    conf.chunks = ['common', itemName[1]]
    for (let i in confTitle) {
        if (confTitle[i].name === itemName[1]) {
            conf.title = confTitle[i].title
        }
    }
    config.plugins.push(new HtmlWebpackPlugin(conf));
});


//按文件名来获取入口文件（即需要生成的模板文件数量）
function getEntry(globPath) {
    let files = glob.sync(globPath);
    let entries = {},
        entry, dirname, basename, pathname, extname;

    for (let i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.join(dirname, basename);
        entries[pathname] = './' + entry;
    }
    return entries;
}*/
