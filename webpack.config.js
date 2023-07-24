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
    };
};