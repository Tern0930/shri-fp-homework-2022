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
import { allPass, andThen, compose, curry, gt, ifElse, lt, modulo, otherwise, partialRight, prop, tap, test, tryCatch } from 'ramda';
import Api from '../tools/api';

 const api = new Api();

 const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    const getStringLength = prop('length');
    const testLowerBoundLength = curry(lt)(2);
    const testUpperBoundLength = curry(gt)(10);
    const validateLength = compose(allPass([testLowerBoundLength, testUpperBoundLength]), getStringLength);
    const validateFloat = curry(test)(/^\d+\.?\d+$/);
    const validate = allPass([validateLength, validateFloat]);
    const checkValidation = curry(ifElse)(validate);
    const throwError = (message, value) => {throw new Error(message)};
    const onValidationSuccess = Math.ceil;
    const onValidationFailure = curry(throwError)('ValidationError');

    const convertBase = curry(api.get)('https://api.tech/numbers/base');
    const toBinaryPrepare = (number) => ({
        from: 10,
        to: 2,
        number: number
    });
    const toBinary = compose(convertBase, toBinaryPrepare);

    const loggedResponse = ({result}) => {
        writeLog(result);
        return result;
    };

    const logger = (arg) => {
        writeLog(arg);
        return arg;
    };
    const loggedCountBinaryDigits = compose(logger, getStringLength);
    const square = (n) => n*n;
    const loggedSquare = compose(logger, square);
    const modulo3 = partialRight(modulo, [3]);
    const loggedModulo3 = compose(logger, modulo3);

    const getAnimal = (id) => {
        return api.get(`https://animals.tech/${id}`, {})
    }
    const logSuccess = ({result}) => {handleSuccess(result)};

    const apiErrorHandler = (e) => {handleError(e)};
    const errorHandler = (e) => {handleError(e.message)};

    const onToBinarySuccess = compose(
        otherwise(apiErrorHandler),
        andThen(logSuccess),
        getAnimal,
        loggedModulo3,
        loggedSquare,
        loggedCountBinaryDigits,
        loggedResponse
    )

    const app =  compose(
        otherwise(apiErrorHandler),
        andThen(onToBinarySuccess),
        toBinary,
        tap(writeLog),
        checkValidation(onValidationSuccess, onValidationFailure),
        tap(writeLog)
    );
    
    const safeApp = tryCatch(app, errorHandler);

    safeApp(value);
}

export default processSequence;
