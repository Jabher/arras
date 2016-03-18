import config from 'config';

import loaders from './webpack.loaders';
import plugins from './webpack.plugins';
import postcss from './webpack.postcss';

const props = config.webpack;
const DEV = config.env.dev;

export default {
    ...props, plugins, postcss,
    module: {
        loaders
    },
    cache: DEV,
    debug: DEV
}