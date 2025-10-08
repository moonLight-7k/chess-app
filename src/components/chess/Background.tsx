import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Position } from './Notation';

const WHITE = 'rgb(100, 133, 68)';
const BLACK = 'rgb(230, 233, 198)';
const CHECK_COLOR = 'rgb(220, 50, 50)';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
});

interface BaseProps {
    white: boolean;
}

interface RowProps extends BaseProps {
    row: number;
    checkedKingSquare?: Position | null;
}

interface SquareProps extends RowProps {
    col: number;
}

const Square = React.memo(({ white, row, col, checkedKingSquare }: SquareProps) => {
    const square = `${String.fromCharCode(97 + col)}${8 - row}`;
    const isCheckedKing = checkedKingSquare === square;

    const backgroundColor = isCheckedKing ? CHECK_COLOR : (white ? WHITE : BLACK);
    const color = white ? BLACK : WHITE;
    const textStyle = { fontWeight: '500' as const, color };
    return (
        <View
            style={{
                flex: 1,
                backgroundColor,
                padding: 4,
                justifyContent: 'space-between',
            }}
        >
            <Text style={[textStyle, { opacity: col === 0 ? 1 : 0 }]}>
                {'' + (8 - row)}
            </Text>
            {row === 7 && (
                <Text style={[textStyle, { alignSelf: 'flex-end' }]}>
                    {String.fromCharCode(97 + col)}
                </Text>
            )}
        </View>
    );
});

const Row = React.memo(({ white, row, checkedKingSquare }: RowProps) => {
    const offset = white ? 0 : 1;
    return (
        <View style={styles.container}>
            {new Array(8).fill(0).map((_, i) => (
                <Square
                    row={row}
                    col={i}
                    key={i}
                    white={(i + offset) % 2 === 1}
                    checkedKingSquare={checkedKingSquare}
                />
            ))}
        </View>
    );
});

interface BackgroundProps {
    checkedKingSquare?: Position | null;
}

const Background = React.memo(({ checkedKingSquare }: BackgroundProps) => {
    return (
        <View style={{ flex: 1 }}>
            {new Array(8).fill(0).map((_, i) => (
                <Row
                    key={i}
                    white={i % 2 === 0}
                    row={i}
                    checkedKingSquare={checkedKingSquare}
                />
            ))}
        </View>
    );
});

export default Background;
