/**
 * Created by user on 2017/12/14/014.
 */

import loader from '.';

export { loader };

// @ts-ignore
export const requireVue = loader.register(require);

export default loader;
