import { Printer } from '@dnlowman/react-native-star-prnt';
import { List, Range } from 'immutable';
import faker from 'faker';

export const createPrinter = (printer?: Partial<Printer>): Printer => ({
    modelName: faker.random.word(),
    macAddress: faker.random.word(),
    portName: faker.random.word(),
    USBSerialNumber: faker.random.word(),
    ...printer
});

export const createPrinters = (amount: number = faker.random.number(10)): List<Printer> =>
    Range(0, amount).map(() => createPrinter()).toList()
