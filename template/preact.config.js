const webpack = require('webpack');
const ESPBuildPlugin = require('./esp/esp-build-plugin');

export default {
    webpack(config, env, helpers, options) {
        if (env.isProd) {
            config.devtool = false;
            config.plugins = [
                ...config.plugins,
                new ESPBuildPlugin({
                    exclude: [
                        '200.html',
                        'preact_prerender_data.json',
                        'push-manifest.json'
                    ]
                })
            ];
        };
    }
};
