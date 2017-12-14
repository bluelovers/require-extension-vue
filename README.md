# require-vue

> A require hook for loading single-file vue component in Node.

`npm i require-vue`

fork from `require-extension-vue`, old README see [here](README.old.md)

## break change

1. remove auto hook
2. rewrite to typescript
3. `vue-loader` like
4. change `exports` return value, see [normalize-component](lib/normalize-component.ts)

## demo

see more api at [source code](https://github.com/bluelovers/require-extension-vue)

1. auto register like old way

```
import loader from 'require-vue/register';
import tsPlugin from 'require-vue/lib/plugin/ts';

loader.use(tsPlugin);
```

2.

```
import loader from 'require-vue';
import tsPlugin from 'require-vue/lib/plugin/ts';

loader.register();
loader.use(tsPlugin);
```

## plugin

tsPlugin can work on old `require-extension-vue` too

```
import * as loader from 'require-extension-vue';
import tsPlugin from 'require-vue/lib/plugin/ts';

tsPlugin.register(loader);
```
