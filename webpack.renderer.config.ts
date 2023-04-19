import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

// rules.push({
//   test: /\.(jpg|png|svg)$/,
//   use: {
//     loader: 'url-loader',
//     options: {
//       limit: 25000,
//     },
//   }
// });

rules.push({
  test: /\.(jpg|png|svg)$/,
  use: {
    loader: 'file-loader',
    options: {
      name: '[path][name].[hash].[ext]',
    },
  }
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.jpg', '.png', '.svg'],
  },
};
