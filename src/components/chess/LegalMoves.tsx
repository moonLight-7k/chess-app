import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chess } from 'chess.js';
import { Position, toTranslation, SIZE } from './Notation';
import { COLORS } from '@/constants/theme';

interface LegalMovesProps {
    moves: Position[];
    chess?: Chess;
}

const LegalMoves: React.FC<LegalMovesProps> = ({ moves, chess }) => {
    if (__DEV__) console.log('=== LegalMoves rendering with moves:', moves);
    return (
        <>
            {moves.map((position) => {
                const { x, y } = toTranslation(position);
                const isCapture = chess?.get(position) !== null;
                if (__DEV__) console.log(`Legal move indicator at ${position}: x=${x}, y=${y}, isCapture=${isCapture}`);

                return (
                    <View
                        key={position}
                        style={[
                            styles.indicator,
                            {
                                transform: [
                                    { translateX: x },
                                    { translateY: y },
                                ],
                            },
                        ]}
                    >
                        {isCapture ? (
                            <View style={styles.captureRing} />
                        ) : (
                            <View style={styles.dot} />
                        )}
                    </View>
                );
            })}
        </>
    );
};

const styles = StyleSheet.create({
    indicator: {
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    dot: {
        width: SIZE * 0.3,
        height: SIZE * 0.3,
        borderRadius: SIZE * 0.15,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    captureRing: {
        width: SIZE * 0.3,
        height: SIZE * 0.3,
        borderRadius: SIZE * 0.15,
        backgroundColor: COLORS.background,
        opacity: 0.6
    },
});

export default React.memo(LegalMoves);
