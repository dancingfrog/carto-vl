import * as s from '../../../../../src/renderer/viz/expressions';
import { validateStaticType, validateStaticTypeErrors } from './utils';

describe('src/renderer/viz/expressions/ordering', () => {
    describe('error control', () => {
        validateStaticTypeErrors('asc', []);
        validateStaticTypeErrors('asc', [undefined]);
        validateStaticTypeErrors('asc', [123]);
        validateStaticTypeErrors('asc', ['number']);

        validateStaticTypeErrors('desc', []);
        validateStaticTypeErrors('desc', [undefined]);
        validateStaticTypeErrors('desc', [123]);
        validateStaticTypeErrors('desc', ['number']);
    });

    describe('type', () => {
        validateStaticType('asc', [s.width()], 'orderer');
        validateStaticType('desc', [s.width()], 'orderer');
        validateStaticType('noOrder', [], 'orderer');
    });
});
