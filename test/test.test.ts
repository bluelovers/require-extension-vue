/**
 * Created by user on 2017/12/14/014.
 */

import localDev, { relative, expect, path, assert, util } from './_local-dev';

import { loader, IComponentModule } from '..';
import tsLoader from '../lib/plugin/ts';

loader.register();
loader.use(tsLoader);

// @ts-ignore
describe(relative(__filename), () =>
{
	let currentTest;

	beforeEach(function ()
	{
		currentTest = this.currentTest;

		//console.log('it:before', currentTest.title);
		//console.log('it:before', currentTest.fullTitle());
	});

	describe(`require vue`, () =>
	{
		let testVueModeule: IComponentModule;

		before(async function ()
		{
			testVueModeule = await import('./temp/test.vue');

		});

		it(`require.extensions['.vue']`, function ()
		{
			expect(require.extensions['.vue']).to.be.deep.equal(loader);
		});

		it(`testVueModeule`, async function ()
		{
			console.log(testVueModeule);

			//console.log('it:inner', currentTest.title);
			//console.log('it:inner', currentTest.fullTitle());

			expect(testVueModeule).to.be.ok;
			expect(testVueModeule.esModule).to.be.ok;
			expect(testVueModeule.default).to.be.ok;

			expect(testVueModeule.default).to.be.deep.equal(testVueModeule.esModule.default);

			//assert.isOk(r.value, util.inspect(r));
		});

		it(`default`, async function ()
		{
			let def_exports = testVueModeule.default;

			expect(def_exports).to.be.ok;
			expect(def_exports.name).to.be.equal('test');
			expect(def_exports._scopeId).to.be.ok;
		});

		it(`vueComponent`, async function ()
		{
			let vueComponent = testVueModeule.vueComponent;

			expect(vueComponent).to.be.ok;
			expect(vueComponent).to.be.deep.equal(testVueModeule.esModule.vueComponent);
		});

		it(`i18n`, async function ()
		{
			let def_exports = testVueModeule.default;

			console.log(def_exports.__i18n);

			expect(def_exports.__i18n).to.be.ok;
			expect(def_exports.__i18n.length).to.be.ok;
			expect(def_exports.__i18n[0].ja.hello).to.be.equal('こんにちは、世界!');
		});

		it(`esModule`, async function ()
		{
			let esModule = testVueModeule.esModule;

			expect(esModule.vueComponent).to.be.ok;
			expect(esModule.vueComponent.template).to.be.ok;
			expect(esModule.vueComponent.script).to.be.ok;
			expect(esModule.vueComponent.styles).to.be.ok;
			expect(esModule.vueComponent.template).to.be.ok;
		});
	});
});
