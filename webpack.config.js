const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Import MiniCssExtractPlugin
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env and .env.local files
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local', override: true });

module.exports = (env, argv) => {
  // Determine if the build mode is production or development
  const isProduction = process.env.APP_MODE === 'prod';

  console.log('isProduction => ', isProduction);

  return {
    // Set the mode for Webpack. 'production' enables optimizations, 'development' is for debugging.
    mode: isProduction ? 'production' : 'development',

    // Entry point for the application. This is where Webpack starts bundling.
    entry: './src/index.tsx',

    output: {
      // The name of the output bundle.
      filename: 'bundle.js',

      // The path to the output directory, where the bundled files will be saved.
      path: path.resolve(__dirname, 'dist'),
    },

    resolve: {
      // Extensions to resolve, allowing for imports without specifying the file extension.
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@src': path.resolve(__dirname, 'src'), // Alias for the src directory
        '@pages': path.resolve(__dirname, 'src/pages'), // Alias for the pages directory
        '@components': path.resolve(__dirname, 'src/components'), // Alias for the components directory
        // Add other aliases as needed
      },
    },

    module: {
      rules: [
        {
          // Rule for processing TypeScript files.
          test: /\.tsx?$/,
          use: 'ts-loader', // Use ts-loader to transpile TypeScript files.
          exclude: /node_modules/, // Exclude node_modules from processing.
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader', // Extract CSS in production
            'css-loader',
            'sass-loader'
          ],
        },
        {
          test: /\.(ico)$/,
          type: 'asset/resource', // Ensures favicon.ico is handled as a static asset
          generator: {
            filename: 'favicon.ico', // Place favicon in the root of the output directory
          },
        },
      ],
    },

    plugins: [
      // Plugin to generate an HTML file from a template, and include the bundled assets.
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),

      // Define global constants for use in the application.
      new webpack.DefinePlugin({
        'process.env.APP_MODE': JSON.stringify(process.env.APP_MODE),
      }),

      isProduction && new MiniCssExtractPlugin({
        filename: 'styles.css' // Output CSS file
      }), // Only add plugin in production
    ],

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
