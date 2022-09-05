import processSequence from '../helpers/processSequence';

const devNull = () => {};
const wait = () => new Promise(res => setTimeout(res, 4500));

describe('Функция processSequence', () => {

  let logs = [];

  const writeLog = (val) => logs.push(val);
  const handleSuccess = (val) => logs.push(val);
  const handleError = (val) => logs.push(val);

  beforeEach(() => {
    logs = [];
  });

  it('функция валидации проходит верно', () => {
    const validationLogs = [];
    const handleValidationErrors = (val) => validationLogs.push(val);

    processSequence({value: '#2324$', writeLog: devNull, handleSuccess: devNull, handleError: handleValidationErrors});
    processSequence({value: '25', writeLog: devNull, handleSuccess: devNull, handleError: handleValidationErrors});
    processSequence({value: '231232255123231232323123123', writeLog: devNull, handleSuccess: devNull, handleError: handleValidationErrors});
    processSequence({value: 'abcdef', writeLog: devNull, handleSuccess: devNull, handleError: handleValidationErrors});

    expect(validationLogs).toEqual([
      'ValidationError',
      'ValidationError',
      'ValidationError',
      'ValidationError'
    ]);
  });

  it('записывает в лог верные аргументы в случае успешной последовательности до собаки', async() => {
    processSequence({value: '155.5', writeLog, handleSuccess, handleError});

    await wait();

    logs = logs.map(String);

    expect(logs).toEqual([
      "155.5",
      '156', // округление + приведение к числу
      "10011100", // в binary
      '8', // кол-во символов
      '64', // квадрат
      "1", // остаток
      "dog", // достали животное из API
    ]);
  });

  it('записывает в лог верные аргументы в случае успешной последовательности до кошки', async() => {
    processSequence({value: '155542', writeLog, handleSuccess, handleError});

    await wait();

    logs = logs.map(String);

    expect(logs).toEqual([
      "155542",
      '155542',
      "100101111110010110",
      '18',
      '324',
      "0",
      "cat",
    ]);
  });
});
