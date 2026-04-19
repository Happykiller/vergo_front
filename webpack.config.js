// webpack.config.js
const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const { version } = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Load environment variables from .env and .env.local files
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

module.exports = (env, argv) => {
  console.log(`Webpack:process.env.APP_MODE => '${process.env.APP_MODE}'`);

  // Determine if the build mode is production or development
  const isProduction = process.env.APP_MODE === 'prod';

  return {
    // Set the mode for Webpack. 'production' enables optimizations, 'development' is for debugging.
    mode: isProduction ? 'production' : 'development',

    // Entry point for the application. This is where Webpack starts bundling.
    entry: './src/index.tsx',

    output: {
      clean: true,

      // The name of the output bundle.
      filename: 'bundle.[contenthash].js',

      // The path to the output directory, where the bundled files will be saved.
      path: path.resolve(__dirname, 'dist'),

      publicPath: '/',
    },

    resolve: {
      // Extensions to resolve, allowing for imports without specifying the file extension.
      extensions: ['.tsx', '.ts', '.js', '.json', '.scss', '.svg', '.woff', '.woff2', '.ttf', '.eot'],
      alias: {
        '@src': path.resolve(__dirname, 'src'), // Alias for the src directory
        '@pages': path.resolve(__dirname, 'src/pages'), // Alias for the pages directory
        '@components': path.resolve(__dirname, 'src/components'), // Alias for the components directory
        '@usecases': path.resolve(__dirname, 'src/usecases'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@stores': path.resolve(__dirname, 'src/stores'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
        // ⛑️ Force React/MUI/Emotion to resolve from the main project's node_modules
        // This avoids duplicate instances when using `npm link` during development
        react: path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        '@emotion/react': path.resolve(__dirname, 'node_modules/@emotion/react'),
        '@emotion/styled': path.resolve(__dirname, 'node_modules/@emotion/styled'),
        '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material'),
        '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material'),
        'react-router-dom': path.resolve(__dirname, 'node_modules/react-router-dom'),
        'react-i18next': path.resolve(__dirname, 'node_modules/react-i18next'),
      },
    },

    module: {
      rules: [
        {
          // Rule for processing TypeScript files.
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                declaration: false,
                declarationMap: false,
              },
            },
          }, // Use ts-loader to transpile TypeScript files.
          exclude: /node_modules/, // Exclude node_modules from processing.
        },
        {
          test: /\.(s[ac]ss|css)$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(ico)$/,
          type: 'asset/resource', // Ensures favicon.ico is handled as a static asset
          generator: {
            filename: 'favicon.ico', // Place favicon in the root of the output directory
          },
        }
      ],
    },

    plugins: [
      new WebpackBar(),
      // Plugin to generate an HTML file from a template, and include the bundled assets.
      new HtmlWebpackPlugin({
        template: './src/index.html',
        favicon: './src/public/favicon.ico',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
        },
      }),

      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/public', to: '' }, // Copie les favicons et le manifest dans le dossier de build
        ],
      }),

      // Define global constants for use in the application.
      new webpack.DefinePlugin({
        'process.env.APP_MODE': JSON.stringify(process.env.APP_MODE),
        'process.env.API_URL': JSON.stringify(process.env.API_URL),
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG ?? false),
        'process.env.VERSION': JSON.stringify(version),
      }),

      isProduction && new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css' // Output CSS file
      }), // Only add plugin in production
    ],

    optimization: {
      splitChunks: {
        chunks: 'all', // Divise tous les types de chunks
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
      runtimeChunk: 'single',
    },

    devServer: {
      // Serve static files from the 'public' directory.
      static: {
        directory: path.join(__dirname, 'public'),
      },

      // Enable gzip compression for better performance.
      compress: true,

      // Port number for the development server.
      port: 9000,

      // Redirect 404s to index.html to handle client-side routing
      historyApiFallback: true,
    },
  };
};
