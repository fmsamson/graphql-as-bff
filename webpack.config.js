const TerserPlugin = require('terser-webpack-plugin');

module.exports = (options, webpack) => {
    const lazyImports = [
        '@nestjs/microservices/microservices-module',
        '@nestjs/websockets/socket-module',
        '@as-integrations/fastify',
        '@apollo/subgraph',
        '@apollo/gateway',
        '@apollo/subgraph/package.json',
        '@apollo/subgraph/dist/directives',
        'class-transformer/storage',
        'ts-morph'
    ];

    return {
        ...options,
        externals: [
            { fsevents: "require('fsevents')" }
        ],
        output: {
            ...options.output,
            libraryTarget: 'commonjs2',
        },
        plugins:[
            ...options.plugins,
            new webpack.IgnorePlugin({
                checkResource(resource) {
                    if(lazyImports.includes(resource)) {
                        try {
                            require.resolve(resource);
                        } catch(err) {
                            return true;
                        }
                    }
                    return false;
                }
            }),
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        keep_classnames: true,
                        keep_fnames: true,
                        compress: {
                            drop_console: true,
                        },
                        format: {
                            comments: false,
                        },
                        mangle: true,
                    },
                    extractComments: false,
                }),
            ],
        },
    };
};