import React, { useCallback } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { toTranslation, SIZE, toPosition, Vector, Position } from './Notation';

const styles = StyleSheet.create({
    piece: {
        width: SIZE,
        height: SIZE,
    },
    pieceText: {
        fontSize: SIZE * 0.8,
        textAlign: 'center',
        lineHeight: SIZE,
    },
    selectedBorder: {
        position: 'absolute',
        width: SIZE,
        height: SIZE,
        borderWidth: 3,
        borderColor: '#FFD700',
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
    },
});

type Player = 'b' | 'w';
type Type = 'q' | 'r' | 'n' | 'b' | 'k' | 'p';
type Piece = `${Player}${Type}`;

const PIECE_SYMBOLS: Record<Piece, string> = {
    wk: '♔',
    wq: '♕',
    wr: '♖',
    wb: '♗',
    wn: '♘',
    wp: '♙',
    bk: '♚',
    bq: '♛',
    br: '♜',
    bb: '♝',
    bn: '♞',
    bp: '♟',
};

type Pieces = Record<Piece, ReturnType<typeof require>>;

export const PIECES: Pieces = {
    br: require('../../../assets/chess/br.png'),
    bp: require('../../../assets/chess/bp.png'),
    bn: require('../../../assets/chess/bn.png'),
    bb: require('../../../assets/chess/bb.png'),
    bq: require('../../../assets/chess/bq.png'),
    bk: require('../../../assets/chess/bk.png'),
    wr: require('../../../assets/chess/wr.png'),
    wn: require('../../../assets/chess/wn.png'),
    wb: require('../../../assets/chess/wb.png'),
    wq: require('../../../assets/chess/wq.png'),
    wk: require('../../../assets/chess/wk.png'),
    wp: require('../../../assets/chess/wp.png'),
};

interface PieceProps {
    id: Piece;
    startPosition: Vector;
    square: Position;
    onMove: (from: Position, to: Position) => boolean;
    onSelect: (square: Position) => void;
    onSquarePress: (square: Position) => void;
    enabled: boolean;
    isSelected: boolean;
}

const ChessPiece = ({
    id,
    startPosition,
    square,
    onMove,
    onSelect,
    onSquarePress,
    enabled,
    isSelected,
}: PieceProps) => {
    // Simple position tracking for tap-to-select/tap-to-move
    const translateX = useSharedValue(startPosition.x * SIZE);
    const translateY = useSharedValue(startPosition.y * SIZE);

    // DRAG GESTURE DISABLED - Using tap-to-select/tap-to-move only
    // Uncomment below if you want drag-and-drop functionality
    /*
    const isGestureActive = useSharedValue(false);
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);

    const movePiece = useCallback(
        (to: Position) => {
            const from = toPosition({ x: offsetX.value, y: offsetY.value });

            // Attempt the move through the centralized handler
            const moveSuccessful = onMove(from, to);

            // Get the final position for animation
            const finalPosition = moveSuccessful ? to : from;
            const { x, y } = toTranslation(finalPosition);

            // Animate to final position (either destination if valid, or snap back if invalid)
            translateX.value = withTiming(
                x,
                { duration: moveSuccessful ? 200 : 150 },
                () => (offsetX.value = translateX.value)
            );
            translateY.value = withTiming(
                y,
                { duration: moveSuccessful ? 200 : 150 },
                () => {
                    offsetY.value = translateY.value;
                    isGestureActive.value = false;
                }
            );
        },
        [isGestureActive, offsetX, offsetY, onMove, translateX, translateY]
    );
    */

    // TAP-TO-SELECT/TAP-TO-MOVE - Active
    const tapGesture = Gesture.Tap()
        .onEnd(() => {
            if (enabled) {
                scheduleOnRN(onSelect, square);
            }
        })
        .enabled(enabled);

    // DRAG-AND-DROP - Disabled (uncomment to enable)
    /*
    const panGesture = Gesture.Pan()
        .onStart(() => {
            'worklet';
            offsetX.value = translateX.value;
            offsetY.value = translateY.value;
            isGestureActive.value = true;
        })
        .onUpdate((e) => {
            'worklet';
            translateX.value = offsetX.value + e.translationX;
            translateY.value = offsetY.value + e.translationY;
        })
        .onEnd(() => {
            'worklet';
            const finalPos = toPosition({ x: translateX.value, y: translateY.value });
            runOnJS(movePiece)(finalPos);
        })
        .enabled(enabled);

    const composedGesture = Gesture.Exclusive(panGesture, tapGesture);
    */

    // Simple static positioning for tap interaction
    const style = useAnimatedStyle(() => ({
        position: 'absolute',
        zIndex: 10,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    // DRAG VISUAL FEEDBACK - Disabled (uncomment to enable)
    /*
    const style = useAnimatedStyle(() => ({
        position: 'absolute',
        zIndex: isGestureActive.value ? 100 : 10,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    const original = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            width: SIZE,
            height: SIZE,
            zIndex: 0,
            backgroundColor: isGestureActive.value
                ? 'rgba(255, 255, 0, 0.5)'
                : 'transparent',
            transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
        };
    });

    const underlay = useAnimatedStyle(() => {
        const position = toPosition({ x: translateX.value, y: translateY.value });
        const translation = toTranslation(position);
        return {
            position: 'absolute',
            width: SIZE,
            height: SIZE,
            zIndex: 0,
            backgroundColor: isGestureActive.value
                ? 'rgba(255, 255, 0, 0.5)'
                : 'transparent',
            transform: [{ translateX: translation.x }, { translateY: translation.y }],
        };
    });
    */

    return (
        <>
            {/* TAP-TO-SELECT/TAP-TO-MOVE - Simple interaction */}
            <GestureDetector gesture={tapGesture}>
                <Animated.View style={style}>
                    {isSelected && <View style={styles.selectedBorder} />}
                    <Image source={PIECES[id]} style={styles.piece} />
                </Animated.View>
            </GestureDetector>

            {/* DRAG-AND-DROP VISUAL ELEMENTS - Disabled (uncomment to enable)
            <>
                <Animated.View style={original}>
                    {isSelected && <View style={styles.selectedBorder} />}
                </Animated.View>
                <Animated.View style={underlay} />
                <GestureDetector gesture={composedGesture}>
                    <Animated.View style={style}>
                        {isSelected && <View style={styles.selectedBorder} />}
                        <Image source={PIECES[id]} style={styles.piece} />
                    </Animated.View>
                </GestureDetector>
            </>
            */}
        </>
    );
};

export default React.memo(ChessPiece);

