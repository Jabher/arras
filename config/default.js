export const env = {
    dev: true
};
export const server = {
    port: 8088,
    hostname: undefined,
    https: false
};

const baseDir = process.cwd();

export const paths = {
    baseDir,
    controllersDir: `${baseDir}/endpoints`,
    webappDir: `${baseDir}/webapp`,
    webpackConfigDir: `${baseDir}/webpack.config.babel`,
    staticDir: `${baseDir}/static`
};

export const db = {
    path: 'http://neo4j:password@localhost:7474'    
};