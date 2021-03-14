# preact-simple-esp

A simple, minimal "Hello World" template for Preact CLI for being used on a ESP8266/ESP32

## About

TBD.

## Usage

### Preact

To bootstrap a new project based on this template simply type:  
`preact create mruettgers/preact-template-esp [YOUR PROJECT NAME]`

When ready build as usual:  
`npm run build`

If your build succeeds you will find a file named `static_files.h` within your build folder that could be directly included in your application.
<details>
  <summary>Show sample of "static_files.h"</summary>
    
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
</details>

## ESP8266WebServer and ESP32's native webserver

```c++
#include <WiFi.h>
#ifdef ESP32
#include <WebServer.h>
#elif defined(ESP8266)
<ESP8266WebServer.h
#endif
#include "web/static_files.h"

WebServer server(80);

const char *ssid = "YOUR SSID";
const char *password = "YOUR PASSWORD";

void setup()
{
  WiFi.begin(ssid, password);
  Serial.begin(115200);
  delay(100);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.print("Connected to: ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Optional, defines the default entrypoint
  server.on("/", [] {
    server.sendHeader("Content-Encoding", "gzip");
    server.send_P(200, "text/html", (const char *)static_files::f_index_html_contents, static_files::f_index_html_size);
  });

  // Create a route handler for each of the build artifacts
  for (int i = 0; i < static_files::num_of_files; i++)
  {
    server.on(static_files::files[i].path, [i] {
      server.sendHeader("Content-Encoding", "gzip");
      server.send_P(200, static_files::files[i].type, (const char *)static_files::files[i].contents, static_files::files[i].size);
    });
  }
  server.begin();
}

void loop() {
  server.handleClient();
}
```

## ESP Async WebServer

```c++
#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif
#include <ESPAsyncWebServer.h>
#include "web/static_files.h"

AsyncWebServer server(80);

const char *ssid = "YOUR SSID";
const char *password = "YOUR PASSWORD";

void setup()
{

  WiFi.begin(ssid, password);
  Serial.begin(115200);
  delay(100);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.print("Connected to: ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // Optional, defines the default entrypoint
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    AsyncWebServerResponse *response = request->beginResponse_P(200, "text/html", static_files::f_index_html_contents, static_files::f_index_html_size);
    response->addHeader("Content-Encoding", "gzip");
    request->send(response);
  });

  // Create a route handler for each of the build artifacts
  for (int i = 0; i < static_files::num_of_files; i++)
  {
    server.on(static_files::files[i].path, HTTP_GET, [i](AsyncWebServerRequest *request) {
      AsyncWebServerResponse *response = request->beginResponse_P(200, static_files::files[i].type, static_files::files[i].contents, static_files::files[i].size);
      response->addHeader("Content-Encoding", "gzip");
      request->send(response);
    });
  }
  server.begin();
}

void loop() {}
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
