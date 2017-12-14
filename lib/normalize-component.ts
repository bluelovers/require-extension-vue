/**
 * Created by user on 2017/12/14/014.
 */

'use strict';

export interface IComponentModule
{
	/**
	 * raw module exports
	 */
	esModule;

	/**
	 * for create Vue Component
	 */
	exports;
	default;

	options;

	/**
	 * for lazy fork vue plugin code
	 */
	'$options';

	/**
	 * module path
	 */
	__fire: string;
}

export function normalizeComponent(rawScriptExports, scopeId: string, vueModule): IComponentModule
{
	let esModule;
	let scriptExports = rawScriptExports = rawScriptExports || {};

	{
		let type = typeof rawScriptExports.default;
		if (type === 'object' || type === 'function')
		{
			esModule = rawScriptExports;
			scriptExports = rawScriptExports.default;
		}
	}

	let options = typeof scriptExports === 'function'
		? scriptExports.options
		: scriptExports;
	if (scopeId)
	{
		options._scopeId = scopeId;
	}

	return Object.defineProperty({
		/**
		 * raw module exports
		 */
		esModule: esModule,

		/**
		 * for create Vue Component
		 */
		exports: scriptExports,
		options: options,

		default: scriptExports,

		/**
		 * for lazy fork vue plugin code
		 */
		'$options': scriptExports,

		__fire: vueModule.filename,
	}, "__esModule", { value: true });
}

// @ts-ignore
export default normalizeComponent;
