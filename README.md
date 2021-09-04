# video2webp

A small project to use `ffmpeg.wasm` to convert videos to animated WebP images in the browser.


## Run locally

Using WASM like this requires certain HTTP headers to be set. To run locally, use the included python3 server, like this:

```shell
$ python3 server.py
```

## Dependencies

* ffmpeg.wasm - https://github.com/ffmpegwasm/ffmpeg.wasm - various licenses - this project uses an unmodified version of `ffmpeg.wasm`, found here: https://github.com/ffmpegwasm/ffmpeg.wasm/releases/tag/v0.10.1
* normalize.css - https://github.com/necolas/normalize.css - MIT License - this project uses an unmodified version of `normalize.css`, found here: https://github.com/necolas/normalize.css/releases/tag/8.0.1

