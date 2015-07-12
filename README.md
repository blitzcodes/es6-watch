# Hence.io ES6 Watch

For building ES6 libraries or Node modules which you need to have pre-compiled to es5 for consumption.

This leverages gulp, babel, browserify, and optionally eslint, focused on JS development solely.

## Process

Add paths/root sources to the ```.es6src.json``` to bundle and compile your es6 with source maps.

```
{
    "folder/path":"index-filename.js"
}
```

This will watch all js files in that folder, and build and package a '[index-filename].es6.js' file, or whatever your root file is named.

## Starting the Watcher

```gulp``` will watch your path and generating the compiled source.

```gulp lint``` will watch with the eslint running as well.