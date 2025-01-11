const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const { version } = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

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
      // The name of the output bundle.
      filename: 'bundle.[contenthash].js',

      // The path to the output directory, where the bundled files will be saved.
      path: path.resolve(__dirname, 'dist'),

      publicPath: '/',
    },

    resolve: {
      // Extensions to resolve, allowing for imports without specifying the file extension.
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        '@src': path.resolve(__dirname, 'src'), // Alias for the src directory
        '@pages': path.resolve(__dirname, 'src/pages'), // Alias for the pages directory
        '@components': path.resolve(__dirname, 'src/components'), // Alias for the components directory
        '@usecases': path.resolve(__dirname, 'src/usecases'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@stores': path.resolve(__dirname, 'src/stores'),
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
      new FaviconsWebpackPlugin({
        logo: './src/public/logo.png', // Chemin vers votre logo de base
        mode: 'webapp', // Génère des icônes pour PWA
        devMode: 'webapp', // Utilisation en développement
        favicons: {
          appName: 'Vergo Front',
          appDescription: 'Fitness Coach',
          developerName: 'Fabrice Rosito',
          developerURL: null, // Peut être défini si vous souhaitez une URL
          background: '#ffffff',
          theme_color: '#3367D6',
          icons: {
            android: true, // Génère les icônes pour Android
            appleIcon: true, // Génère les icônes Apple
            appleStartup: false, // Pas nécessaire pour cette utilisation
            favicons: true,
            windows: false, // Peut être désactivé pour des besoins réduits
            yandex: false // Pas nécessaire
          }
        }
      }),

      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [
          '**/*',        // Par défaut, nettoie tout le contenu de "dist"
          'dist/src/',   // Spécifie explicitement la suppression du dossier "src" dans "dist"
        ],
        verbose: true, // Affiche les fichiers supprimés dans la console (utile pour le débogage)
      }),  // Nettoie le dossier dist avant chaque build

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
        'process.env.DEBUG': JSON.stringify(process.env.DEBUG??false),
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
