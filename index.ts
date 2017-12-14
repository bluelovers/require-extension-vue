'use strict';

import * as fs from 'fs';
import * as css from 'css';
import * as hash from 'hash-sum';
import * as cssWhat from 'css-what';
import * as stripBom from 'strip-bom';
import * as compiler from 'vue-template-compiler';
import normalizeComponent from './lib/normalize-component';

/**
 * @fork https://github.com/fb55/css-what/blob/master/stringify.js
 * @type {Function} stringify
 */
cssWhat.stringify = require('./lib/css-what/stringify');

/**
 * In Browser Environment
 * @type {Boolean} browserEnv
 */
let browserEnv = false;
try
{
	document;
	browserEnv = true;
}
catch (e)
{}

/**
 * Save Loaders of different Language
 * @type {Object} store
 */
let store = {
	style: {
		defaults: '',
		langs: {},
		exports(style)
		{
			document.head.appendChild(style);
		},
	},
	script: {
		defaults: '',
		langs: {},
	},
	template: {
		defaults: '',
		langs: {},
	},
};

/**
 * Set default Loader of different Language
 * @param {String} type | style | script | template |
 * @param {String} lang scss, ts, jade etc.
 */
function set(type, lang)
{
	store[type].defaults = lang;
}

/**
 * Register Loader of different Language
 * @param {String | String[]} type | style | script | template |
 * @param {String} lang scss, ts, jade etc.
 * @param {Function} handler
 */
function register(type, lang, handler)
{
	if (Array.isArray(lang))
	{
		lang.forEach((v) => store[type].langs[v] = handler);
		return;
	}
	store[type].langs[lang] = handler;
}

/**
 * Require extension vue hook
 * @param {Module} module
 * @param {String} filePath file path
 * @export {Vue} Vue Component after compile
 */
export function loader(vueModule, filePath)
{
	let content = fs.readFileSync(filePath, 'utf8');
	let scopeId = `data-v-${ hash(filePath) }`;

	let vueTemplate = '';
	let vueComponent = compiler.parseComponent(stripBom(content));

	let script = vueComponent.script;
	let styles = vueComponent.styles;
	let template = vueComponent.template;

	let scoped = styles.some(({ attrs }) => attrs.scoped);

	[].concat(script, template, styles).forEach((tag, index) =>
	{
		if (tag)
		{
			let type = tag.type;
			let content = tag.content;
			let lang = tag.attrs.lang || store[type].defaults;
			let handler = store[type].langs[lang];
			if (handler)
			{
				content = handler(content, filePath, index, vueModule);
			}
			switch (type)
			{
				case 'style':
					if (browserEnv)
					{
						/**
						 * Only in Browser Environment, append style to head
						 */
						if (tag.attrs.scoped)
						{
							let ast = css.parse(content);
							ast.stylesheet.rules.forEach((rule) =>
							{
								rule.selectors = rule.selectors.map((selector) =>
								{
									let [patterns] = cssWhat(selector);
									let index = patterns.length - 1;
									for (; index >= 0; index--)
									{
										let { type } = patterns[index];
										if (type !== 'pseudo' && type !== 'pseudo-element')
										{
											break;
										}
									}
									patterns.splice(index + 1, 0, {
										value: '',
										name: scopeId,
										action: 'exists',
										type: 'attribute',
										ignoreCase: false,
									});
									return cssWhat.stringify([patterns]);
								});
							});
							content = css.stringify(ast);
						}
						let style = document.createElement('style');
						style.innerHTML = content;
						store.style.exports.call(vueModule.exports, style, {
							index,
							styles,
							filePath,
						});
					}
					break;
				case 'script':
					vueModule._compile(content, filePath);
					break;
				case 'template':
					if (browserEnv)
					{
						/**
						 * Only in Browser Environment, set Attribute for each element
						 */
						if (scoped)
						{
							let div = document.createElement('div');
							div.innerHTML = content;
							let root = div.firstElementChild;
							let walk = function walk(element, handler)
							{
								handler(element);
								let children = element.children || [];
								[].forEach.call(children, (child) =>
								{
									walk(child, handler);
								});
							};
							walk(root, (element) =>
							{
								element.setAttribute(scopeId, '');
							});
							content = div.innerHTML;
						}
					}
					vueTemplate = content;
					break;
			}
		}
	});

	console.log(vueModule);

	vueModule.exports.vueComponent = vueComponent;
	vueModule.exports.template = vueTemplate;

	vueModule.exports = normalizeComponent(vueModule.exports, scopeId, vueModule);
}

/**
 * Exports API to expand
 */
['style', 'script', 'template'].forEach((type) =>
{
	loader[type] = {
		set(lang)
		{
			set(type, lang);
			return this;
		},
		register(lang, handler)
		{
			register(type, lang, handler);
			return this;
		},
	};
});

/**
 * Handler of creating styles
 * @param {Function} handler
 */
loader.style.exports = (handler) =>
{
	store.style.exports = handler;
	return this;
};

export namespace loader
{
	/**
	 * Register Loader as default .vue hook
	 */
	export function register(targetRequire = require)
	{
		targetRequire.extensions['.vue'] = targetRequire.extensions['.vue'] || loader;
	}

	export function use(pligins)
	{
		(Array.isArray(pligins) ? pligins : [pligins])
			.forEach(function (pligin)
			{
				pligin.register(loader);
			})
		;

		return loader;
	}
}

/**
 * @export {Function} loader
 */
export default loader;
