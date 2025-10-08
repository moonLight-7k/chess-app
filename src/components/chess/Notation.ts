/* eslint-disable prefer-destructuring */
import { Dimensions } from 'react-native';

export interface Vector {
    x: number;
    y: number;
}

const { width } = Dimensions.get('window');
export const SIZE = width / 8;

export type Position = string;

export const toTranslation = (to: Position): Vector => {
    'worklet';
    const tokens = to.split('');
    const col = tokens[0];
    const row = tokens[1];
    if (!col || !row) {
        throw new Error('Invalid notation: ' + to);
    }
    const indexes = {
        x: col.charCodeAt(0) - 'a'.charCodeAt(0),
        y: parseInt(row, 10) - 1,
    };
    return {
        x: indexes.x * SIZE,
        y: 7 * SIZE - indexes.y * SIZE,
    };
};

export const toPosition = ({ x, y }: Vector): Position => {
    'worklet';
    const col = String.fromCharCode(97 + Math.round(x / SIZE));
    const row = `${8 - Math.round(y / SIZE)}`;
    return `${col}${row}`;
};
