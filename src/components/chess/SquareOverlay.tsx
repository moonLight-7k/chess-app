import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SIZE } from './Notation';

interface SquareOverlayProps {
    onSquarePress: (square: string) => void;
}

const SquareOverlay: React.FC<SquareOverlayProps> = ({ onSquarePress }) => {
    const squares: string[] = [];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = `${String.fromCharCode(97 + col)}${8 - row}`;
            squares.push(square);
        }
    }

    return (
        <View style={styles.container}>
            {squares.map((square, index) => {
                const row = Math.floor(index / 8);
                const col = index % 8;
                return (
                    <TouchableOpacity
                        key={square}
                        style={[
                            styles.square,
                            {
                                left: col * SIZE,
                                top: row * SIZE,
                            },
                        ]}
                        onPress={() => onSquarePress(square)}
                        activeOpacity={1}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 50,
    },
    square: {
        position: 'absolute',
        width: SIZE,
        height: SIZE,
    },
});

export default React.memo(SquareOverlay);
