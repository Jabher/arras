const {env} = require('config');
const DEV = env.dev;

export default [
    require('postcss-normalize')(),
    require('lost')(),
    require('postcss-import')(),
    require('postcss-cssnext')(),
    require('autoprefixer')(
        DEV
            ? ['Chrome >= 40']
            : [
            'Android 2.3',
            'Android >= 4',
            'Chrome >= 20',
            'Firefox >= 24',
            'Explorer >= 10',
            'iOS >= 6',
            'Opera >= 12',
            'Safari >= 6'
        ]),
    require('postcss-font-magician')()
]