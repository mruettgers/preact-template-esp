const mime = require('mime-types')
const ejs = require('ejs');
const fs = require('fs');
const { gzip, gzipSync } = require('zlib');

const readFile = function (filename) {
    var response = "";
    var data = gzipSync(fs.readFileSync(filename));
    for (i = 0; i < data.length; i++) {
        if (i % 16 == 0) response += "\n";
        response += '0x' + ('00' + data[i].toString(16)).slice(-2);
        if (i < data.length - 1) response += ', ';
    }
    return {
        contents: response,
        size: data.length,
    }
}

class ESPBuildPlugin {
    constructor(env) {
        this.env = env;
    }
    apply(compiler) {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
            const files = Array.from(compilation.assetsInfo.keys());
            const data = {
                files: files
                    .filter(file => {
                        if (file === '200.html') {
                            return false;
                        }
                        return true;
                    })
                    .map(file => {
                        const path = this.env.dest + '/' + file;
                        const mimeType = mime.lookup(path)
                        return {
                            path: '/' + file,
                            normalizedName: file.replace(/[^0-9a-z]/ig, '_'),
                            mimeType,
                            ...readFile(path)
                        };
                    })
            };
            ejs.renderFile(
                'esp/static_files_h.ejs',
                data,
                {},
                function (err, str) {
                    fs.writeFileSync(this.env.dest + '/static_files.h', str);
                }.bind(this)
            );
        });
    }
}

module.exports = ESPBuildPlugin;