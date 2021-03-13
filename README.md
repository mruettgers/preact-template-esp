# preact-simple-esp

Documentation is WIP and TBD.

## Usage

### Preact

To bootstrap a new project based on this template simply type:  
`preact create mruettgers/preact-template-esp [YOUR PROJECT NAME]`

When ready build as usual:  
`npm run build`

If your build succeeds you will find a file named `static_files.h` within your build folder like the following one:

```c++
#pragma once
namespace static_files
{
    struct file
    {
        const char *path;
        uint32_t size;
        const char *type;
        const uint8_t *contents;
    };
    
    const uint32_t f_index_html_size PROGMEM = 350;     
    const uint8_t f_index_html_contents[] PROGMEM = {        
        0x1f, 0x8b, 0x08, ...
    };
    
    const uint32_t f_bundle_c3928_css_size PROGMEM = 108;     
    const uint8_t f_bundle_c3928_css_contents[] PROGMEM = {        
        0x1f, 0x8b, 0x08, ...
    };
    
    const file files[] PROGMEM = {  
        {.path = "/index.html",
            .size = f_index_html_size,
            .type = "text/html",
            .contents = f_index_html_contents},
        {.path = "/bundle.c3928.css",
            .size = f_bundle_c3928_css_size,
            .type = "text/css",
            .contents = f_bundle_c3928_css_contents},
    };

    const uint8_t num_of_files PROGMEM = sizeof(files) / sizeof(const file);
}
```

## ESP8266WebServer

```c++
#include <ESP8266WebServer.h>
#include "web/static_files.h"
ESP8266WebServer server(80);

// Optional, defines the default entrypoint
server.on("/", [] {
    server.sendHeader(F("Content-Encoding"), F("gzip"));
    server.send_P(200, "text/html", (const char*)static_files::f_index_html_contents, static_files::f_index_html_size);
});  

// Create a route handler for each of the build artifacts
for (int i = 0; i< static_files::num_of_files; i++) {
    server.on(static_files::files[i].path, [i] {
        server.sendHeader(F("Content-Encoding"), F("gzip"));
        server.send_P(200, static_files::files[i].type, (const char*)static_files::files[i].contents, static_files::files[i].size);
    });  
}
```
## Acknowledgements

This template is based on [https://github.com/preactjs-templates/simple](https://github.com/preactjs-templates/simple), a simple, minimal "Hello World" template for Preact CLI.

## Donate

### Bitcoin
16XujKGLtx1Lp9ZTvdbpY6Km7jbLHjW2sD

### Paypal
[![Paypal](https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GK95YZCEGJT84)

### Buy me a coffee
<a href="https://www.buymeacoffee.com/fkqeNT2" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-green.png" alt="Buy Me A Coffee" height="51" width="217"></a>

## License

Distributed under the GPL v3 license.  
See [LICENSE](LICENSE) for more information.
