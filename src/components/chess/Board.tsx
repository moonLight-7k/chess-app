import React, { useCallback, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Chess, Move } from 'chess.js';

import Background from './Background';
import ChessPiece from './Piece';
import LegalMoves from '../chess/LegalMoves';
import SquareOverlay from './SquareOverlay';
import { Position } from './Notation';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width,
        height: width,
    },
});

interface BoardProps {
    onTurn?: (chess: Chess) => void;
}

const Board: React.FC<BoardProps> = ({ onTurn }) => {
    const [chess] = useState(() => new Chess());
    const [state, setState] = useState({
        player: 'w',
        board: chess.board(),
    });
    const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);

    const checkedKingSquare = useMemo(() => {
        if (chess.isCheck()) {
            const board = chess.board();
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    const piece = board[y][x];
                    if (piece && piece.type === 'k' && piece.color === state.player) {
                        return `${String.fromCharCode(97 + x)}${8 - y}` as Position;
                    }
                }
            }
        }
        return null;
    }, [chess, state.board, state.player]);

    const legalMoves = useMemo(() => {
        if (!selectedSquare) return [];
        const moves = (chess.moves({
            square: selectedSquare,
            verbose: true
        }) as Move[]).map(move => move.to);
        return moves;
    }, [selectedSquare, chess, state.board]);

    const handleTurn = useCallback(() => {
        setState({
            player: chess.turn(),
            board: chess.board(),
        });
        setSelectedSquare(null);
        onTurn?.(chess);
    }, [chess, onTurn]);

    // Centralized move function - single source of truth for all moves
    const makeMove = useCallback((from: Position, to: Position): boolean => {
        const move = chess.move({ from, to });
        if (move) {
            handleTurn();
            return true;
        }
        return false;
    }, [chess, handleTurn]);

    const handlePieceSelect = useCallback((square: Position) => {
        setSelectedSquare(prev => {
            const newValue = prev === square ? null : square;
            if (__DEV__) console.log('New selectedSquare value:', newValue);
            return newValue;
        });
    }, []);

    const handleSquarePress = useCallback((square: Position) => {
        if (selectedSquare && legalMoves.includes(square)) {
            if (__DEV__) console.log('Attempting to move from', selectedSquare, 'to', square);
            const success = makeMove(selectedSquare, square);
            if (__DEV__ && success) console.log('Move successful');
        } else {
            const piece = chess.get(square);
            if (__DEV__) console.log('Piece at square:', piece);
            if (piece && piece.color === state.player) {
                if (__DEV__) console.log('Setting selected square to:', square);
                setSelectedSquare(square);
            } else {
                if (__DEV__) console.log('No valid piece to select (piece:', piece, 'player:', state.player, ')');
            }
        }
    }, [selectedSquare, legalMoves, chess, state.player, makeMove]);

    const pieces = useMemo(() => {
        const piecesList: Array<{
            key: string;
            id: `${'w' | 'b'}${'q' | 'r' | 'n' | 'b' | 'k' | 'p'}`;
            position: { x: number; y: number };
            square: Position;
            enabled: boolean;
        }> = [];

        state.board.forEach((row, y) => {
            row.forEach((piece, x) => {
                if (piece !== null) {
                    const square = `${String.fromCharCode(97 + x)}${8 - y}` as Position;
                    piecesList.push({
                        key: `${piece.color}${piece.type}-${square}`,
                        id: `${piece.color}${piece.type}` as const,
                        position: { x, y },
                        square,
                        enabled: state.player === piece.color,
                    });
                }
            });
        });

        return piecesList;
    }, [state.board, state.player]);


    return (
        <View style={styles.container}>
            <Background checkedKingSquare={checkedKingSquare} />
            <LegalMoves moves={legalMoves} chess={chess} />
            {pieces.map((piece) => {
                const isSelected = piece.square === selectedSquare;

                return (
                    <ChessPiece
                        key={piece.key}
                        id={piece.id}
                        startPosition={piece.position}
                        square={piece.square}
                        onMove={makeMove}
                        onSelect={handlePieceSelect}
                        onSquarePress={handleSquarePress}
                        enabled={piece.enabled}
                        isSelected={isSelected}
                    />
                );
            })}
            <SquareOverlay onSquarePress={handleSquarePress} />
        </View>
    );
};

// Memo comparison function to prevent unnecessary re-renders
const arePropsEqual = (prevProps: BoardProps, nextProps: BoardProps) => {
    // Only re-render if onTurn callback changes (which it shouldn't if properly memoized in parent)
    return prevProps.onTurn === nextProps.onTurn;
};

export default React.memo(Board, arePropsEqual);
