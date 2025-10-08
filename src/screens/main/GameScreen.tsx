import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Vibration, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Chess } from 'chess.js';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { getFont } from '../../utils/typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types';
import MatchEndModal from '../../components/MatchEndModal';
import Board from '../../components/chess/Board';
import ErrorBoundary from '../../components/ErrorBoundary';

type GameScreenProps = {
    navigation: NativeStackNavigationProp<MainStackParamList, 'Game'>;
};

const { width, height } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - (SPACING.lg * 2), 400);

type GameState = 'waiting' | 'playing' | 'finished';

const GameScreen: React.FC<GameScreenProps> = ({ navigation }) => {
    const [gameState, setGameState] = useState<GameState>('waiting');
    const [timer, setTimer] = useState(0);
    const [opponentTime, setOpponentTime] = useState(0);
    const [opponentProgress, setOpponentProgress] = useState(0); // 0-100
    const [playerProgress, setPlayerProgress] = useState(0);
    const [showMatchEndModal, setShowMatchEndModal] = useState(false);
    const [puzzleObjective] = useState("Checkmate your opponent!");
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

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const progressAnimOpponent = useRef(new Animated.Value(0)).current;
    const progressAnimPlayer = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const waitingDotAnim = useRef(new Animated.Value(0)).current;

    // Memoize handleMatchEnd to prevent stale closures
    const handleMatchEnd = useCallback((winner: 'you' | 'opponent' | 'draw') => {
        setGameState('finished');

        // Haptic feedback based on result
        if (winner === 'you') {
            Vibration.vibrate([0, 100, 50, 100]); // Victory pattern
        } else {
            Vibration.vibrate(200); // Defeat vibration
        }

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
    }, [timer, opponentTime, moveCount]);

    useEffect(() => {
        // Waiting dot animation
        const waitingDotAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(waitingDotAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(waitingDotAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        );
        waitingDotAnimation.start();

        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // Simulate waiting period before match starts
        const waitTimer = setTimeout(() => {
            setGameState('playing');
            // Haptic feedback when match starts
            Vibration.vibrate(50);
        }, 3000);

        return () => {
            waitingDotAnimation.stop();
            clearTimeout(waitTimer);
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        let pulseAnimation: Animated.CompositeAnimation | null = null;

        if (gameState === 'playing') {
            // Pulse animation for active timer
            pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulseAnimation.start();

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

        return () => {
            if (interval) {
                clearInterval(interval);
            }
            if (pulseAnimation) {
                pulseAnimation.stop();
            }
        };
    }, [gameState, handleMatchEnd]);

    // Animate progress bars
    useEffect(() => {
        Animated.spring(progressAnimOpponent, {
            toValue: opponentProgress,
            useNativeDriver: false,
            friction: 8,
            tension: 40,
        }).start();
    }, [opponentProgress]);

    useEffect(() => {
        Animated.spring(progressAnimPlayer, {
            toValue: playerProgress,
            useNativeDriver: false,
            friction: 8,
            tension: 40,
        }).start();
    }, [playerProgress]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChessTurn = useCallback((chess: Chess) => {
        // Haptic feedback on move
        Vibration.vibrate(30);

        // Update move count when a turn is made
        setMoveCount(prev => prev + 1);
        setPlayerProgress(prev => Math.min(prev + 10, 100));

        // Check for game over conditions
        if (chess.isCheckmate()) {
            handleMatchEnd('you');
        } else if (chess.isDraw() || chess.isStalemate()) {
            handleMatchEnd('draw');
        }
    }, [handleMatchEnd]);

    const handleGiveUp = useCallback(() => {
        Alert.alert(
            'Give Up',
            'Are you sure you want to give up this match?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Give Up',
                    style: 'destructive',
                    onPress: () => {
                        Vibration.vibrate(50);
                        handleMatchEnd('opponent');
                    }
                },
            ]
        );
    }, [handleMatchEnd]);

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            Vibration.vibrate(30);
                            navigation.goBack();
                        }}
                        style={styles.backButton}
                        accessible={true}
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                    >
                        <Icon name="arrow-back" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Puzzle Race</Text>
                    <TouchableOpacity
                        style={styles.menuButton}
                        accessible={true}
                        accessibilityLabel="Menu options"
                        accessibilityRole="button"
                    >
                        <Icon name="ellipsis-vertical" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                {/* Game State Indicator */}
                {gameState === 'waiting' && (
                    <Animated.View
                        style={[
                            styles.waitingBanner,
                            { opacity: waitingDotAnim }
                        ]}
                    >
                        <ActivityIndicator color={COLORS.background} style={{ marginRight: SPACING.sm }} />
                        <Text style={styles.waitingText}>Finding opponent...</Text>
                    </Animated.View>
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
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                width: progressAnimOpponent.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%']
                                }),
                                backgroundColor: COLORS.error
                            }
                        ]}
                    />
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
                    <ErrorBoundary>
                        <Board onTurn={handleChessTurn} />
                    </ErrorBoundary>
                </View>

                {/* Player Progress Bar */}
                <View style={styles.progressBarContainer}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                width: progressAnimPlayer.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%']
                                }),
                                backgroundColor: COLORS.success
                            }
                        ]}
                    />
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
                    <Animated.View
                        style={[
                            styles.timerContainer,
                            styles.activeTimer,
                            { transform: [{ scale: pulseAnim }] }
                        ]}
                    >
                        <Icon name="time" size={16} color={COLORS.text} style={{ marginRight: 4 }} />
                        <Text style={[styles.timerText, { color: COLORS.text }]}>{formatTime(timer)}</Text>
                    </Animated.View>
                </View>

                {/* Control Buttons */}
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => {
                            Vibration.vibrate(30);
                            // Reset will need to reset the chess board
                            // We can handle this by passing a ref or state to Board component
                        }}
                        disabled={gameState !== 'playing'}
                        accessible={true}
                        accessibilityLabel="Reset board"
                        accessibilityRole="button"
                    >
                        <Icon name="refresh" size={24} color={gameState === 'playing' ? COLORS.text : COLORS.textSecondary} />
                        <Text style={[styles.controlButtonText, gameState !== 'playing' && { color: COLORS.textSecondary }]}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => Vibration.vibrate(30)}
                        disabled={gameState !== 'playing'}
                        accessible={true}
                        accessibilityLabel="Get hint"
                        accessibilityRole="button"
                    >
                        <Icon name="bulb" size={24} color={gameState === 'playing' ? COLORS.warning : COLORS.textSecondary} />
                        <Text style={[styles.controlButtonText, gameState !== 'playing' && { color: COLORS.textSecondary }]}>Hint</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={handleGiveUp}
                        disabled={gameState !== 'playing'}
                        accessible={true}
                        accessibilityLabel="Give up"
                        accessibilityRole="button"
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
                        Vibration.vibrate(30);
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
                        Vibration.vibrate(30);
                        // Implement share functionality
                    }}
                    onBackToHome={() => {
                        Vibration.vibrate(30);
                        setShowMatchEndModal(false);
                        navigation.navigate('Home');
                    }}
                />
            </Animated.View>
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
        flexDirection: 'row',
        justifyContent: 'center',
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
