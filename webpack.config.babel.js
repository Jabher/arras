import config from 'config';

const props = config.webpack;
const DEV = config.env.dev;

import loaders from './webpack.loaders';
import plugins from './webpack.plugins';
import postcss from './webpack.postcss';

export default {
    ...props,
    module: {
        loaders
    },
    cache: DEV,
    debug: DEV,
    plugins: plugins,
    postcss
}