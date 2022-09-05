import {compose, sequence, flip, of, repeat, zipObj} from 'ramda';

import {
    validateFieldN1,
    validateFieldN2,
    validateFieldN3,
    validateFieldN4,
    validateFieldN5,
    validateFieldN6,
    validateFieldN7,
    validateFieldN8,
    validateFieldN9,
    validateFieldN10,
} from '../helpers/validators';

const permutations = compose(sequence(of), flip(repeat));

const zipShapes = zipObj(['circle', 'triangle', 'square', 'star']);

const stabs = permutations(4, ['green', 'white', 'orange', 'red']).map(zipShapes);

[
    validateFieldN1,
    validateFieldN2,
    validateFieldN3,
    validateFieldN4,
    validateFieldN5,
    validateFieldN6,
    validateFieldN7,
    validateFieldN8,
    validateFieldN9,
    validateFieldN10,
].map((fn, i) => ({fn, name: `validateFieldN${i + 1}`})).forEach(({fn, name}, i) => {
    describe(`Для ${name}`, () => {
        stabs.forEach(stab => {
            it(`Верное возвращаемое булевое для аргументов ${JSON.stringify(stab)}`, () => {
                expect(fn(stab)).toMatchSnapshot();
            });
        });
    });
});
