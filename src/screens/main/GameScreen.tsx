import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { getFont } from '../../utils/typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types';
import MatchEndModal from '../../components/MatchEndModal';

type GameScreenProps = {
    navigation: NativeStackNavigationProp<MainStackParamList, 'Game'>;
};

const { width, height } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - (SPACING.lg * 2), 400);
const SQUARE_SIZE = BOARD_SIZE / 8;

type GameState = 'waiting' | 'playing' | 'finished';
type PieceType = 'K' | 'Q' | 'R' | 'B' | 'N' | 'P' | 'k' | 'q' | 'r' | 'b' | 'n' | 'p' | null;

interface ChessPosition {
    row: number;
    col: number;
}

interface ChessPiece {
    type: PieceType;
    position: ChessPosition;
}

const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
    const [gameState, setGameState] = useState<GameState>('waiting');
    const [timer, setTimer] = useState(0);
    const [opponentTime, setOpponentTime] = useState(0);
    const [opponentProgress, setOpponentProgress] = useState(0); // 0-100
    const [playerProgress, setPlayerProgress] = useState(0);
    const [showMatchEndModal, setShowMatchEndModal] = useState(false);
    const [selectedSquare, setSelectedSquare] = useState<ChessPosition | null>(null);
    const [legalMoves, setLegalMoves] = useState<ChessPosition[]>([]);
    const [puzzleObjective, setPuzzleObjective] = useState("Find mate in 2 moves");
    const [moveCount, setMoveCount] = useState(0);
    const [wagerAmount] = useState(0.05); // SOL wager amount
    const [matchResult, setMatchResult] = useState<{
        winner: 'you' | 'opponent' | 'draw';
        yourTime: number;
        opponentTime?: number;
        eloChange: number;
        moves: number;
        puzzleSolution?: string[];
        badgeEarned?: {
            name: string;
            description: string;
            explorerUrl?: string;
        };
    } | null>(null);

    // Initialize a sample puzzle position
    const [board, setBoard] = useState<(PieceType)[][]>([
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
    ]);

    useEffect(() => {
        // Simulate waiting period before match starts
        const waitTimer = setTimeout(() => {
            setGameState('playing');
        }, 3000);

        return () => clearTimeout(waitTimer);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameState === 'playing') {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
                setOpponentTime((prev) => prev + 1);

                // Simulate opponent progress
                setOpponentProgress((prev) => {
                    const newProgress = prev + Math.random() * 2;
                    if (newProgress >= 100) {
                        handleMatchEnd('opponent');
                        return 100;
                    }
                    return Math.min(newProgress, 100);
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState]);

    const handleMatchEnd = (winner: 'you' | 'opponent' | 'draw') => {
        setGameState('finished');
        const eloChange = winner === 'you' ? 15 : -10;

        // Sample puzzle solution
        const puzzleSolution = [
            'Qh7+ (Queen to h7, check)',
            'Kf8 (King forced to f8)',
            'Qh8# (Queen to h8, checkmate)'
        ];

        // Sample badge earned (only if you win)
        const badgeEarned = winner === 'you' ? {
            name: 'Speed Demon',
            description: 'Win 5 matches under 3 minutes',
            explorerUrl: 'https://explorer.solana.com/address/YOUR_NFT_ADDRESS'
        } : undefined;

        setMatchResult({
            winner,
            yourTime: timer,
            opponentTime: opponentTime,
            eloChange,
            moves: moveCount,
            puzzleSolution,
            badgeEarned,
        });
        setShowMatchEndModal(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getPieceSymbol = (piece: PieceType): string => {
        const symbols: { [key: string]: string } = {
            'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
            'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟',
        };
        return piece ? symbols[piece] : '';
    };

    const handleSquarePress = (row: number, col: number) => {
        if (gameState !== 'playing') return;

        const piece = board[row][col];

        // If a square is already selected
        if (selectedSquare) {
            // Check if the pressed square is a legal move
            const isLegalMove = legalMoves.some(
                move => move.row === row && move.col === col
            );

            if (isLegalMove) {
                // Make the move
                const newBoard = board.map(r => [...r]);
                newBoard[row][col] = board[selectedSquare.row][selectedSquare.col];
                newBoard[selectedSquare.row][selectedSquare.col] = null;
                setBoard(newBoard);
                setMoveCount(prev => prev + 1);
                setPlayerProgress(prev => Math.min(prev + 25, 100)); // Each move = 25% progress

                // Check if puzzle is solved
                if (playerProgress + 25 >= 100) {
                    handleMatchEnd('you');
                }
            }

            // Deselect
            setSelectedSquare(null);
            setLegalMoves([]);
        } else if (piece && piece === piece.toUpperCase()) {
            // Select white piece (uppercase = white)
            setSelectedSquare({ row, col });
            // Generate some legal moves (simplified - in real app, calculate actual legal moves)
            const moves: ChessPosition[] = [];
            if (row > 0) moves.push({ row: row - 1, col });
            if (row > 0 && col > 0) moves.push({ row: row - 1, col: col - 1 });
            if (row > 0 && col < 7) moves.push({ row: row - 1, col: col + 1 });
            setLegalMoves(moves.filter(m => !board[m.row][m.col] || board[m.row][m.col] === board[m.row][m.col]?.toLowerCase()));
        }
    };

    const isSquareSelected = (row: number, col: number) => {
        return selectedSquare?.row === row && selectedSquare?.col === col;
    };

    const isLegalMove = (row: number, col: number) => {
        return legalMoves.some(move => move.row === row && move.col === col);
    };

    const renderChessBoard = () => {
        const boardElements = [];
        for (let row = 0; row < 8; row++) {
            const rowSquares = [];
            for (let col = 0; col < 8; col++) {
                const isLight = (row + col) % 2 === 0;
                const piece = board[row][col];
                const selected = isSquareSelected(row, col);
                const legal = isLegalMove(row, col);

                rowSquares.push(
                    <TouchableOpacity
                        key={`${row}-${col}`}
                        style={[
                            styles.square,
                            { backgroundColor: isLight ? '#EBECD0' : '#779556' },
                            selected && styles.selectedSquare,
                            legal && styles.legalMoveSquare,
                        ]}
                        onPress={() => handleSquarePress(row, col)}
                        disabled={gameState !== 'playing'}
                    >
                        {piece && (
                            <Text style={[
                                styles.pieceText,
                                { color: piece === piece.toUpperCase() ? '#FFFFFF' : '#000000' }
                            ]}>
                                {getPieceSymbol(piece)}
                            </Text>
                        )}
                        {legal && <View style={styles.legalMoveDot} />}
                    </TouchableOpacity>
                );
            }
            boardElements.push(
                <View key={row} style={styles.row}>
                    {rowSquares}
                </View>
            );
        }
        return boardElements;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Puzzle Race</Text>
                <TouchableOpacity style={styles.menuButton}>
                    <Icon name="ellipsis-vertical" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            {/* Game State Indicator */}
            {gameState === 'waiting' && (
                <View style={styles.waitingBanner}>
                    <Text style={styles.waitingText}>Finding opponent...</Text>
                </View>
            )}

            {/* Opponent Info */}
            <View style={styles.playerInfo}>
                <View style={styles.playerAvatar}>
                    <Icon name="person" size={24} color={COLORS.error} />
                </View>
                <View style={styles.playerDetails}>
                    <Text style={styles.playerName}>Opponent</Text>
                    <Text style={styles.playerElo}>ELO: 1450</Text>
                </View>
                <View style={styles.timerContainer}>
                    <Icon name="time" size={16} color={COLORS.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={styles.timerText}>{formatTime(opponentTime)}</Text>
                </View>
            </View>

            {/* Opponent Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${opponentProgress}%`, backgroundColor: COLORS.error }]} />
            </View>

            {/* Puzzle Objective */}
            <View style={styles.puzzleObjective}>
                <Icon name="bulb" size={20} color={COLORS.warning} />
                <Text style={styles.puzzleObjectiveText}>{puzzleObjective}</Text>
            </View>

            {/* Wager Display */}
            {wagerAmount > 0 && (
                <View style={styles.wagerContainer}>
                    <View style={styles.wagerBadge}>
                        <Icon name="logo-bitcoin" size={16} color={COLORS.secondary} />
                        <Text style={styles.wagerText}>{wagerAmount} SOL</Text>
                    </View>
                    <Text style={styles.wagerLabel}>Prize Pool</Text>
                </View>
            )}

            {/* Chess Board */}
            <View style={styles.boardContainer}>
                <View style={styles.board}>{renderChessBoard()}</View>
            </View>

            {/* Player Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${playerProgress}%`, backgroundColor: COLORS.success }]} />
            </View>

            {/* Your Info */}
            <View style={[styles.playerInfo, styles.yourPlayerInfo]}>
                <View style={[styles.playerAvatar, styles.yourAvatar]}>
                    <Icon name="person" size={24} color={COLORS.primary} />
                </View>
                <View style={styles.playerDetails}>
                    <Text style={styles.playerName}>You</Text>
                    <Text style={styles.playerElo}>ELO: 1500</Text>
                </View>
                <View style={[styles.timerContainer, styles.activeTimer]}>
                    <Icon name="time" size={16} color={COLORS.text} style={{ marginRight: 4 }} />
                    <Text style={[styles.timerText, { color: COLORS.text }]}>{formatTime(timer)}</Text>
                </View>
            </View>

            {/* Control Buttons */}
            <View style={styles.controls}>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => {
                        setSelectedSquare(null);
                        setLegalMoves([]);
                    }}
                    disabled={gameState !== 'playing'}
                >
                    <Icon name="refresh" size={24} color={gameState === 'playing' ? COLORS.text : COLORS.textSecondary} />
                    <Text style={[styles.controlButtonText, gameState !== 'playing' && { color: COLORS.textSecondary }]}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.controlButton}
                    disabled={gameState !== 'playing'}
                >
                    <Icon name="bulb" size={24} color={gameState === 'playing' ? COLORS.warning : COLORS.textSecondary} />
                    <Text style={[styles.controlButtonText, gameState !== 'playing' && { color: COLORS.textSecondary }]}>Hint</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => handleMatchEnd('opponent')}
                    disabled={gameState !== 'playing'}
                >
                    <Icon name="flag" size={24} color={gameState === 'playing' ? COLORS.error : COLORS.textSecondary} />
                    <Text style={[styles.controlButtonText, gameState !== 'playing' && { color: COLORS.textSecondary }]}>Give Up</Text>
                </TouchableOpacity>
            </View>

            {/* Move Counter */}
            <View style={styles.moveCounter}>
                <Text style={styles.moveCounterText}>Moves: {moveCount}</Text>
            </View>

            {/* Match End Modal */}
            <MatchEndModal
                visible={showMatchEndModal}
                onClose={() => setShowMatchEndModal(false)}
                matchResult={matchResult}
                wagerAmount={wagerAmount}
                onRematch={() => {
                    setShowMatchEndModal(false);
                    setGameState('waiting');
                    setTimer(0);
                    setOpponentTime(0);
                    setPlayerProgress(0);
                    setOpponentProgress(0);
                    setMoveCount(0);
                    setTimeout(() => setGameState('playing'), 2000);
                }}
                onShare={() => {
                    // Implement share functionality
                }}
                onBackToHome={() => {
                    setShowMatchEndModal(false);
                    navigation.navigate('Home');
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: SPACING.xs,
    },
    menuButton: {
        padding: SPACING.xs,
    },
    headerTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.text,
        fontFamily: getFont('bold').fontFamily,
    },
    waitingBanner: {
        backgroundColor: COLORS.warning,
        paddingVertical: SPACING.sm,
        alignItems: 'center',
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.md,
        borderRadius: 8,
    },
    waitingText: {
        color: COLORS.background,
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        fontFamily: getFont('bold').fontFamily,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.card,
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.md,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    yourPlayerInfo: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.card,
    },
    playerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
        borderWidth: 2,
        borderColor: COLORS.error,
    },
    yourAvatar: {
        borderColor: COLORS.primary,
    },
    playerDetails: {
        flex: 1,
    },
    playerName: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        color: COLORS.text,
        fontFamily: getFont('bold').fontFamily,
    },
    playerElo: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontFamily: getFont('regular').fontFamily,
        marginTop: 2,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 8,
    },
    activeTimer: {
        backgroundColor: COLORS.primary,
    },
    timerText: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        fontFamily: getFont('bold').fontFamily,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: COLORS.card,
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.xs,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    puzzleObjective: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.warning,
    },
    puzzleObjectiveText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text,
        fontFamily: getFont('medium').fontFamily,
        marginLeft: SPACING.sm,
    },
    wagerContainer: {
        alignItems: 'center',
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.sm,
    },
    wagerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 20,
        gap: SPACING.xs,
        borderWidth: 2,
        borderColor: COLORS.secondary,
    },
    wagerText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.secondary,
        fontWeight: 'bold',
        fontFamily: getFont('bold').fontFamily,
    },
    wagerLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        fontFamily: getFont('regular').fontFamily,
    },
    boardContainer: {
        alignItems: 'center',
        marginVertical: SPACING.md,
    },
    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        borderWidth: 3,
        borderColor: COLORS.border,
        borderRadius: 8,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
    },
    square: {
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedSquare: {
        backgroundColor: '#F6F669 !important',
        opacity: 0.8,
    },
    legalMoveSquare: {
        opacity: 0.9,
    },
    legalMoveDot: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    pieceText: {
        fontSize: SQUARE_SIZE * 0.7,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.sm,
    },
    controlButton: {
        alignItems: 'center',
        padding: SPACING.sm,
        minWidth: 70,
    },
    controlButtonText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        fontFamily: getFont('medium').fontFamily,
    },
    moveCounter: {
        alignItems: 'center',
        marginTop: SPACING.xs,
        marginBottom: SPACING.md,
    },
    moveCounterText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontFamily: getFont('medium').fontFamily,
    },
});

export default GameScreen;
