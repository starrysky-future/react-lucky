const path = require("path");

// js、css自动引入到html
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 清空打包目录
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// css样式link
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 压缩css代码
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 压缩js
const TerserPlugin = require("terser-webpack-plugin");
console.log("process.env.NODE_ENV=", process.env.NODE_ENV);

const config = {
  entry: "./src/index.js", // 打包入口地址
  output: {
    filename: "bundle.js", // 输出文件名
    path: path.join(__dirname, "dist"),
  },
  module: {
    noParse: "/jquery|lodash/",
    rules: [
      // 转换规则
      {
        test: /\.(s[ac]|c)ss$/i, // 匹配所有的css文件
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ], // use:对应的loader名称
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: "asset/resource",
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: "[name][hash:8][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024, //超过50kb不转 base64
          },
        },
      },
      {
        test: /\.js$/i,
        include: path.resolve("src"),
        exclude: "/node_modules/",
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    // 配置插件
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CleanWebpackPlugin(), // 引入插件
    new MiniCssExtractPlugin({
      filename: "[name].[hash:8].css",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
      new TerserPlugin({}),
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve("src"),
    },
    extensions: [".js", ".json", ".jsx", ".ts", ".tsx"],
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    compress: true, // 是否启动压缩gzip
    port: 8080, // 端口号
    hot: true,
    // open: true, // 是否自动打开浏览器
  },
  target: "web",
};

module.exports = (env, argv) => {
  console.log("argv.mode=", argv.mode);
  return config;
};
