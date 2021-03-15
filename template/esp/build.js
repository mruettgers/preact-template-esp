import mime from 'mime-types';
import ejs from 'ejs';
import { readFileSync, writeFileSync } from 'fs';
import { gzipSync } from 'zlib';

class ESPBuildPlugin {
    constructor(options) {
        this.compiler = null;
        this.assets = [];
        this.options = options || {};
        this.pluginName = this.constructor.name;
    }

    apply(compiler) {
        this.compiler = compiler;
        compiler.hooks.assetEmitted.tap(this.pluginName, (file) => {
            this.addAsset(file);
        });
        compiler.hooks.afterEmit.tap(this.pluginName, () => {
            this.createESPOutputFile();
        });
    }

    addAsset(file) {
        for (var pattern of (this.options.exclude || [])) {
            if (file.match(pattern) !== null) {
                // Asset is excluded
                return false;
            }
        }
        const path = this.compiler.options.output.path + '/' + file;
        const mimeType = mime.lookup(path)
        const asset = this.readAndProcessAsset(path);
        this.assets.push({
            path: '/' + file,
            normalizedName: file.replace(/[^0-9a-z]/ig, '_'),
            mimeType,
            ...asset
        })
        this.getLogger().info(`Added asset ${file} with a size of ${asset.size} bytes.`);
    }

    readAndProcessAsset(path) {
        var response = "";
        var contents = gzipSync(readFileSync(path));
        for (var i = 0; i < contents.length; i++) {
            if (i % 16 == 0) response += "\n";
            response += '0x' + ('00' + contents[i].toString(16)).slice(-2);
            if (i < contents.length - 1) response += ', ';
        }
        return {
            contents: response,
            size: contents.length,
        }
    }

    createESPOutputFile() {
        ejs.renderFile(
            'esp/static_files_h.ejs',
            {files: this.assets},
            {},
            (err, str) => {
                const outputPath = this.compiler.options.output.path + '/static_files.h';
                writeFileSync(outputPath, str);
                this.getLogger().info(`Build artifact has been written to ${outputPath}.`);

            }
        );
    }

    getLogger() {
        return this.compiler.getInfrastructureLogger(this.pluginName);
    }
}

module.exports = ESPBuildPlugin;