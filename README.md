# require-vue-loader

> A require hook for loading single-file vue component in Node. support i18next, without babel, webpack

`npm i require-vue-loader`

fork from `require-extension-vue`, old README see [here](README.old.md)

## break change

wellcome [report](https://github.com/bluelovers/require-extension-vue/issues) bug

1. remove auto hook
2. rewrite to typescript
3. webpack `vue-loader` like, so u can keep near same code, without change too much
4. change `exports` return value, see [normalize-component](lib/normalize-component.ts)
5. default support i18next so u can use with [vue-i18next2](https://github.com/bluelovers/vue-i18next2)
6. ...more [tell me](https://github.com/bluelovers/require-extension-vue/issues)

## demo

see more api at [source code](https://github.com/bluelovers/require-extension-vue)

1. auto register like old way

```javascript
import loader from 'require-vue-loader/register';
import tsPlugin from 'require-vue-loader/lib/plugin/ts';

loader.use(tsPlugin);

import testVue from './test/temp/test.vue';
```

2.

```javascript
import loader from 'require-vue-loader';
import tsPlugin from 'require-vue-loader/lib/plugin/ts';

loader.register();
loader.use(tsPlugin);

import testVue from './test/temp/test.vue';
```

## plugin

tsPlugin can work on old `require-extension-vue` too

```javascript
import * as loader from 'require-extension-vue';
import tsPlugin from 'require-vue-loader/lib/plugin/ts';

tsPlugin.register(loader);
```
