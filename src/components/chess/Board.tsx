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
        return (chess.moves({
            square: selectedSquare as any,
            verbose: true
        }) as Move[]).map(move => move.to);
    }, [selectedSquare, chess]);

    const handleTurn = useCallback(() => {
        setState({
            player: state.player === 'w' ? 'b' : 'w',
            board: chess.board(),
        });
        setSelectedSquare(null); // Clear selection after move
        onTurn?.(chess);
    }, [chess, state.player, onTurn]);

    const handlePieceSelect = useCallback((square: Position) => {
        setSelectedSquare(prev => prev === square ? null : square);
    }, []);

    const handleSquarePress = useCallback((square: Position) => {
        if (selectedSquare && legalMoves.includes(square as any)) {
            const move = chess.move({ from: selectedSquare as any, to: square as any });
            if (move) {
                handleTurn();
            }
        } else {
            const piece = chess.get(square as any);
            if (piece && piece.color === state.player) {
                setSelectedSquare(square);
            }
        }
    }, [selectedSquare, legalMoves, chess, state.player, handleTurn]);

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
            {pieces.map((piece) => (
                <ChessPiece
                    key={piece.key}
                    id={piece.id}
                    startPosition={piece.position}
                    square={piece.square}
                    chess={chess}
                    onTurn={handleTurn}
                    onSelect={handlePieceSelect}
                    onSquarePress={handleSquarePress}
                    enabled={piece.enabled}
                    isSelected={piece.square === selectedSquare}
                />
            ))}
            <SquareOverlay onSquarePress={handleSquarePress} />
        </View>
    );
};

export default React.memo(Board);
