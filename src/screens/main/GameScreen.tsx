import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Vibration, ActivityIndicator, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Chess } from 'chess.js';
import { COLORS, SPACING, FONT_SIZES, FONT_FAMILIES } from '../../constants/theme';
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
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [puzzleObjective, setPuzzleObjective] = useState("Checkmate your opponent!");
    const [moveCount, setMoveCount] = useState(0);
    const [opponentMoveCount, setOpponentMoveCount] = useState(0);
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

                // Simulate opponent progress and moves
                setOpponentProgress((prev) => {
                    const newProgress = prev + Math.random() * 2;
                    if (newProgress >= 100) {
                        handleMatchEnd('opponent');
                        return 100;
                    }
                    return Math.min(newProgress, 100);
                });

                // Randomly increment opponent move count
                if (Math.random() > 0.7) {
                    setOpponentMoveCount(prev => prev + 1);
                }
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
        setShowMenuModal(false);
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

    const handleExit = useCallback(() => {
        setShowMenuModal(false);
        Alert.alert(
            'Exit Match',
            'Are you sure you want to exit? You will forfeit this match.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Exit',
                    style: 'destructive',
                    onPress: () => {
                        Vibration.vibrate(50);
                        navigation.goBack();
                    }
                },
            ]
        );
    }, [navigation]);

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
                        onPress={() => {
                            Vibration.vibrate(30);
                            setShowMenuModal(true);
                        }}
                        accessible={true}
                        accessibilityLabel="Menu options"
                        accessibilityRole="button"
                    >
                        <Icon name="ellipsis-vertical" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                </View>

                {/* Players Info Section */}
                <View style={styles.playersSection}>

                    {/* Your Info */}
                    <View style={[styles.playerCard, styles.yourPlayerCard]}>
                        <View style={[styles.playerAvatar, styles.yourAvatar]}>
                            <Icon name="person" size={20} color={COLORS.text} />
                        </View>
                        <View style={styles.playerDetails}>
                            <Text style={styles.playerName}>You</Text>
                            <View style={styles.eloContainer}>
                                <Icon name="trophy" size={10} color={COLORS.warning} />
                                <Text style={styles.playerElo}>1500</Text>
                            </View>
                            <View style={styles.movesContainer}>
                                <Icon name="git-commit-outline" size={10} color={COLORS.textSecondary} />
                                <Text style={styles.movesText}>{moveCount} moves</Text>
                            </View>
                        </View>

                        <View style={styles.progressIndicator}>
                            <Text style={[styles.progressText, styles.yourProgressText]}>{Math.round(playerProgress)}%</Text>
                        </View>
                    </View>

                    <View style={styles.timerContainer}>
                        <Icon name="time-outline" size={28} color={COLORS.primary} />
                        <Text style={styles.timerText}>{formatTime(timer)}</Text>
                    </View>

                    {/* Opponent Info */}
                    <View style={styles.playerCard}>
                        <View style={styles.playerAvatar}>
                            <Icon name="person" size={20} color={COLORS.error} />
                        </View>
                        <View style={styles.playerDetails}>
                            <Text style={styles.playerName}>Opponent</Text>
                            <View style={styles.eloContainer}>
                                <Icon name="trophy" size={10} color={COLORS.warning} />
                                <Text style={styles.playerElo}>1450</Text>
                            </View>
                            <View style={styles.movesContainer}>
                                <Icon name="git-commit-outline" size={10} color={COLORS.textSecondary} />
                                <Text style={styles.movesText}>{opponentMoveCount} moves</Text>
                            </View>
                        </View>

                        <View style={styles.progressIndicator}>
                            <Text style={styles.progressText}>{Math.round(opponentProgress)}%</Text>
                        </View>
                    </View>

                </View>

                {/* Puzzle Objective Section */}
                <View style={styles.objectiveSection}>
                    <View style={styles.objectiveCard}>

                        <Icon name="flag-outline" size={16} color={COLORS.secondary} />
                        <Text style={styles.objectiveText}>{puzzleObjective}</Text>
                    </View>
                </View>

                {/* Chess Board */}
                <View style={styles.boardContainer}>
                    <ErrorBoundary>
                        <Board onTurn={handleChessTurn} />
                    </ErrorBoundary>
                </View>

                {/* Wager Pool Section */}
                {wagerAmount > 0 && (
                    <View style={styles.bottomInfoSection}>
                        <View style={styles.wagerPoolCard}>
                            <View style={styles.wagerPoolRow}>
                                <View style={styles.wagerPoolLeft}>
                                    <Text style={styles.wagerLabel}>Wager Amount</Text>
                                    <View style={styles.wagerAmountContainer}>
                                        <Icon name="logo-bitcoin" size={20} color={COLORS.secondary} />
                                        <Text style={styles.wagerAmount}>{wagerAmount} SOL</Text>
                                    </View>
                                </View>
                                <View style={styles.wagerPoolRight}>
                                    <Text style={styles.wagerLabel}>Current Pool</Text>
                                    <View style={styles.poolAmountContainer}>
                                        <Text style={styles.poolAmount}>{(wagerAmount * 2).toFixed(2)} SOL</Text>
                                        <Text style={styles.poolOdds}>2x odds</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

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
                        setOpponentMoveCount(0);
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

                {/* Menu Modal */}
                <Modal
                    visible={showMenuModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowMenuModal(false)}
                >
                    <TouchableOpacity
                        style={styles.menuModalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowMenuModal(false)}
                    >
                        <View style={styles.menuModalContent}>
                            <View style={styles.menuModalHeader}>
                                <Text style={styles.menuModalTitle}>Game Menu</Text>
                                <TouchableOpacity
                                    onPress={() => setShowMenuModal(false)}
                                    style={styles.menuModalCloseButton}
                                >
                                    <Icon name="close" size={24} color={COLORS.text} />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.menuOption}
                                onPress={handleGiveUp}
                                disabled={gameState !== 'playing'}
                            >
                                <Icon
                                    name="flag"
                                    size={24}
                                    color={gameState === 'playing' ? COLORS.error : COLORS.textSecondary}
                                />
                                <View style={styles.menuOptionTextContainer}>
                                    <Text style={[
                                        styles.menuOptionTitle,
                                        gameState !== 'playing' && styles.menuOptionDisabled
                                    ]}>
                                        Give Up
                                    </Text>
                                    <Text style={styles.menuOptionDescription}>
                                        Forfeit the match and lose ELO
                                    </Text>
                                </View>
                            </TouchableOpacity>

                            <View style={styles.menuDivider} />

                            <TouchableOpacity
                                style={styles.menuOption}
                                onPress={handleExit}
                            >
                                <Icon
                                    name="exit-outline"
                                    size={24}
                                    color={COLORS.text}
                                />
                                <View style={styles.menuOptionTextContainer}>
                                    <Text style={styles.menuOptionTitle}>
                                        Exit Match
                                    </Text>
                                    <Text style={styles.menuOptionDescription}>
                                        Leave the game and return to home
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </Animated.View>

            {/* Loading Overlay */}
            {gameState === 'waiting' && (
                <Animated.View
                    style={[
                        styles.loadingOverlay,
                        { opacity: waitingDotAnim }
                    ]}
                >
                    <View style={styles.loadingContent}>
                        <ActivityIndicator size="large" color={COLORS.secondary} />
                        <Text style={styles.loadingText}>Finding opponent...</Text>
                    </View>
                </Animated.View>
            )}
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
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingContent: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.lg,
    },
    loadingText: {
        color: COLORS.text,
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        fontFamily: getFont('bold').fontFamily,
        marginTop: SPACING.md,
    },
    playersSection: {
        marginTop: SPACING.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    playerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingHorizontal: SPACING.xs,
        paddingVertical: SPACING.xs,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        gap: SPACING.sm,
    },
    yourPlayerCard: {
        borderColor: COLORS.text,
    },
    playerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.error,
    },
    yourAvatar: {
        borderColor: COLORS.text,
    },
    playerDetails: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        flexDirection: 'column',

    },
    playerName: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        color: COLORS.text,
        fontFamily: FONT_FAMILIES.bold,
    },
    eloContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginTop: 2,
    },
    playerElo: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontFamily: getFont('medium').fontFamily,
    },
    movesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginTop: 2,
    },
    movesText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontFamily: getFont('regular').fontFamily,
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    activeTimer: {
        backgroundColor: COLORS.primary,
    },
    timerText: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.primary,
        fontFamily: FONT_FAMILIES.bold,
    },
    activeTimerText: {
        color: COLORS.text,
    },
    progressIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
    },
    progressText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.error,
        fontFamily: getFont('bold').fontFamily,
    },
    yourProgressText: {
        color: COLORS.text,
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
    objectiveSection: {
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.md,
        marginBottom: SPACING.sm,
    },
    objectiveCard: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: SPACING.md,
        borderWidth: 1.5,
        borderColor: COLORS.secondary,
        borderLeftWidth: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    objectiveHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.xs,
    },
    objectiveLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.secondary,
        fontFamily: getFont('bold').fontFamily,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    objectiveText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.text,
        fontFamily: getFont('medium').fontFamily,
        lineHeight: 20,
    },
    boardContainer: {
        alignItems: 'center',
        marginVertical: SPACING.md,
    },
    bottomInfoSection: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    wagerPoolCard: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: SPACING.lg,
        borderWidth: 1.5,
        borderColor: COLORS.border,
    },
    wagerPoolRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: SPACING.lg,
    },
    wagerPoolLeft: {
        flex: 1,
    },
    wagerPoolRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    wagerLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontFamily: getFont('medium').fontFamily,
        marginBottom: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    wagerAmountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
    },
    wagerAmount: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.text,
        fontFamily: getFont('bold').fontFamily,
        fontWeight: 'bold',
    },
    poolAmountContainer: {
        alignItems: 'flex-end',
    },
    poolAmount: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.secondary,
        fontFamily: getFont('bold').fontFamily,
        fontWeight: 'bold',
    },
    poolOdds: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontFamily: getFont('medium').fontFamily,
        marginTop: 2,
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
    menuModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    menuModalContent: {
        backgroundColor: COLORS.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: SPACING.xl,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: COLORS.border,
    },
    menuModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    menuModalTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.text,
        fontFamily: getFont('bold').fontFamily,
    },
    menuModalCloseButton: {
        padding: SPACING.xs,
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
        gap: SPACING.md,
    },
    menuOptionTextContainer: {
        flex: 1,
    },
    menuOptionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        color: COLORS.text,
        fontFamily: getFont('bold').fontFamily,
    },
    menuOptionDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontFamily: getFont('regular').fontFamily,
        marginTop: 2,
    },
    menuOptionDisabled: {
        color: COLORS.textSecondary,
    },
    menuDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginHorizontal: SPACING.lg,
    },
});

export default GameScreen;
