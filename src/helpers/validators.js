/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { equals, prop, compose, allPass, anyPass, curry, values, count, lte, not, partialRight, converge } from "ramda";
import { COLORS, SHAPES } from "../constants";

const getColor = (color) => prop(color)(COLORS);
const isColor = compose(equals, getColor);
const isRed = isColor('RED');
const isGreen = isColor('GREEN');
const isBlue = isColor('BLUE');
const isOrange = isColor('ORANGE');
const isWhite = isColor('WHITE');

const getShapes = (shape) => prop(shape)(SHAPES);
const getShape = compose(prop, getShapes);

const getTriangle = getShape('TRIANGLE');
const getSquare = getShape('SQUARE');
const getCircle = getShape('CIRCLE');
const getStar = getShape('STAR');

const isColorAmount = (amount, isColorFunc, shapes) => {
    const colorsAmountTarget = equals(amount);
    const countColors = curry(count)(isColorFunc);
    const res = compose(colorsAmountTarget, countColors, values);

    return res(shapes);
}

const isMoreColorAmount = (amount, isColorFunc, shapes) => {
    const colorsAmountTarget = curry(lte)(amount);
    const countColors = curry(count)(isColorFunc);
    const res = compose(colorsAmountTarget, countColors, values);

    return res(shapes);
}

const isAllColor = (isColorFunc, shapes) => {
    const getLength = compose(prop('length'), values);
    const passArgs = partialRight(isColorAmount, [isColorFunc, shapes]);
    const res = compose(passArgs, getLength);

    return res(shapes);
}

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shapes) => {
    const isWhiteTriangle = compose(isWhite, getTriangle);
    const isWhiteCircle = compose(isWhite, getCircle);
    const isRedStar = compose(isRed, getStar);
    const isGreenSquare = compose(isGreen, getSquare);
    const res = allPass([isWhiteTriangle, isWhiteCircle, isRedStar, isGreenSquare]);

    return res(shapes);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => isMoreColorAmount(2, isGreen, shapes);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
    const countBlue = compose(curry(count)(isBlue), values);
    const countRed = compose(curry(count)(isRed), values);
    const res = converge(equals, [countBlue, countRed]);

    return res(shapes);
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (shapes) => {
    const isBlueCircle = compose(isBlue, getCircle);
    const isRedStar = compose(isRed, getStar);
    const isOrangeSquare = compose(isOrange, getSquare);
    const res = allPass([isBlueCircle, isRedStar, isOrangeSquare]);

    return res(shapes);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shapes) => {
    const isMore3ColorAmount = curry(isMoreColorAmount)(3);
    const reds = isMore3ColorAmount(isRed);
    const blues = isMore3ColorAmount(isBlue);
    const oranges = isMore3ColorAmount(isOrange);
    const greens = isMore3ColorAmount(isGreen);
    const res = anyPass([reds, blues, oranges, greens]);

    return res(shapes);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (shapes) => {
    const is2Green = curry(isColorAmount)(2, isGreen);
    const isGreenTriangle = compose(isGreen, getTriangle);
    const is1Red = curry(isColorAmount)(1, isRed);
    const res = allPass([is2Green, isGreenTriangle, is1Red]);

    return res(shapes);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (shapes) => isAllColor(isOrange, shapes);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (shapes) => {
    const isNotColorStar = (isColorFunc) => compose(not, isColorFunc, getStar);
    const isNotWhiteStar = isNotColorStar(isWhite);
    const isNotRedStar = isNotColorStar(isRed);
    const res = allPass([isNotRedStar, isNotWhiteStar]);

    return res(shapes);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (shapes) => isAllColor(isGreen, shapes);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (shapes) => {
    const isNotWhite = compose(not, isWhite);
    const isNotWhiteTriangle = compose(isNotWhite, getTriangle);
    const isNotWhiteSquare = compose(isNotWhite, getSquare);
    const notWhites = allPass([isNotWhiteSquare, isNotWhiteTriangle])
    const sameColor = converge(equals, [getTriangle, getSquare]);
    const res = allPass([notWhites, sameColor]);

    return res(shapes);
};
