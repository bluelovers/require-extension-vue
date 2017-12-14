# require-vue

> A require hook for loading single-file vue component in Node. support i18next

`npm i require-vue`

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
import loader from 'require-vue/register';
import tsPlugin from 'require-vue/lib/plugin/ts';

loader.use(tsPlugin);
```

2.

```javascript
import loader from 'require-vue';
import tsPlugin from 'require-vue/lib/plugin/ts';

loader.register();
loader.use(tsPlugin);
```

## plugin

tsPlugin can work on old `require-extension-vue` too

```javascript
import * as loader from 'require-extension-vue';
import tsPlugin from 'require-vue/lib/plugin/ts';

tsPlugin.register(loader);
```
