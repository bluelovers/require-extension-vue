/**
 * Created by user on 2017/12/14/014.
 */

import loader from 'ts-eval';
import * as tsEval from 'ts-eval';

/**
 * script lang = typescript | ts
 *
 * @param {} loader
 * @param {boolean} setDefault
 * @returns {}
 */
export function register(loader: loader, setDefault = true): loader
{
	let r = loader
		.script
		.register(['ts', 'typescript'], function (content, filePath, index, module)
		{
			content = tsEval.transpile(content);
			return content;
		})
	;

	if (setDefault)
	{
		r.set('typescript');
	}

	return loader;
}

// @ts-ignore
export default exports;
