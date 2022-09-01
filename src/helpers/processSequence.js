/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { allPass, andThen, compose, curry, gte, ifElse, lte, modulo, otherwise, partialRight, prop, tap, test, tryCatch } from 'ramda';
import Api from '../tools/api';

 const api = new Api();

 const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const getStringLength = prop('length');
    const testLowerBoundLength = curry(lte)(2);
    const testUpperBoundLength = curry(gte)(10);
    const validateLength = compose(allPass([testLowerBoundLength, testUpperBoundLength]), getStringLength);
    const validateFloat = curry(test)(/^\d+\.?\d+$/);
    const validate = allPass([validateLength, validateFloat]);
    const toIntCeil = Math.ceil;
    const checkValidation = ifElse(validate, () => toIntCeil(value), () => {throw new Error('ValidationError')});
    const safeValidation = tryCatch(checkValidation, (e) => {handleError(e.message); return 'NaN'});

    const convertBase = curry(api.get)('https://api.tech/numbers/base');
    const toBinaryPrepare = (number) => ({
        from: 10,
        to: 2,
        number: number
    });
    const toBinary = compose(convertBase, toBinaryPrepare);
    const loggedResponse = ({result}) => {
        writeLog(result); 
        return result
    }
    const logger = (arg) => {
        writeLog(arg);
        return arg;
    }
    const loggedCountBinaryDigits = compose(logger, getStringLength);
    const square = (n) => n*n;
    const loggedSquare = compose(logger, square);
    const modulo3 = partialRight(modulo, [3]);
    const loggedModulo3 = compose(logger, modulo3)

    const getAnimal = (id) => {
        return api.get(`https://animals.tech/${id}`, {})
    }
    const logSuccess = ({result}) => {handleSuccess(result)};

    const app =  compose(
        otherwise((e) => {handleError(e)}),
        andThen(logSuccess),
        andThen(getAnimal),
        andThen(loggedModulo3),
        andThen(loggedSquare),
        andThen(loggedCountBinaryDigits),
        otherwise((e) => {handleError(e)}),
        andThen(loggedResponse),
        toBinary,
        tap(writeLog),
        safeValidation,
        tap(writeLog)
    )

    app(value);
 }

 export default processSequence;
