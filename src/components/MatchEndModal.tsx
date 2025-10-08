import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import { getFont } from '../utils/typography';


interface MatchEndModalProps {
    visible: boolean;
    onClose: () => void;
    matchResult: {
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
    } | null;
    wagerAmount?: number;
    onRematch: () => void;
    onShare: () => void;
    onBackToHome: () => void;
}

const MatchEndModal: React.FC<MatchEndModalProps> = ({
    visible,
    onClose,
    matchResult,
    wagerAmount = 0,
    onRematch,
    onShare,
    onBackToHome,
}) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleViewOnExplorer = async () => {
        if (matchResult?.badgeEarned?.explorerUrl) {
            try {
                const supported = await Linking.canOpenURL(matchResult.badgeEarned.explorerUrl);
                if (supported) {
                    await Linking.openURL(matchResult.badgeEarned.explorerUrl);
                } else {
                    console.error('Cannot open URL:', matchResult.badgeEarned.explorerUrl);
                }
            } catch (error) {
                console.error('Error opening URL:', error);
            }
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.modalContent}>
                        {/* Victory Section */}
                        <View style={styles.victorySection}>
                            <View style={styles.trophyIcon}>
                                <MaterialCommunityIcons
                                    name="trophy-outline"
                                    size={56}
                                    color="#00FFA3"
                                />
                            </View>
                            <Text style={styles.victoryTitle}>Victory!</Text>
                            <Text style={styles.victorySubtitle}>
                                {matchResult?.winner === 'you'
                                    ? 'You solved the puzzle faster!'
                                    : matchResult?.winner === 'opponent'
                                        ? 'Opponent solved faster!'
                                        : 'It\'s a draw!'}
                            </Text>
                        </View>

                        {/* Stats Row */}
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Icon name="time-outline" size={18} color="#9D4EDD" />
                                <Text style={styles.statValue}>
                                    {formatTime(matchResult?.yourTime || 0)}
                                </Text>
                                <Text style={styles.statLabel}>Time</Text>
                            </View>

                            <View style={styles.statCard}>
                                <MaterialCommunityIcons name="trending-up" size={18} color="#00FFA3" />
                                <Text style={[styles.statValue, styles.eloValue]}>
                                    {(matchResult?.eloChange || 0) > 0 ? '+' : ''}{matchResult?.eloChange || 0}
                                </Text>
                                <Text style={styles.statLabel}>ELO</Text>
                            </View>

                            <View style={styles.statCard}>
                                <MaterialCommunityIcons name="chess-knight" size={18} color="#9D4EDD" />
                                <Text style={styles.statValue}>
                                    {matchResult?.moves || 0}
                                </Text>
                                <Text style={styles.statLabel}>Moves</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.playAgainButton]}
                                onPress={onRematch}
                            >
                                <Icon name="refresh" size={18} color="#FFFFFF" />
                                <Text style={styles.playAgainText}>Play Again</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, styles.homeButton]}
                                onPress={onBackToHome}
                            >
                                <Icon name="home-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.actionButtonText}>Home</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionButton, styles.shareButton]}
                                onPress={onShare}
                            >
                                <Icon name="share-social-outline" size={18} color="#FFFFFF" />
                                <Text style={styles.actionButtonText}>Share</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Puzzle Solution Section */}
                        {matchResult?.puzzleSolution && matchResult.puzzleSolution.length > 0 && (
                            <View style={styles.solutionSection}>
                                <View style={styles.solutionHeader}>
                                    <MaterialCommunityIcons name="chess-queen" size={24} color="#9D4EDD" />
                                    <Text style={styles.solutionTitle}>Puzzle Solution</Text>
                                </View>
                                <View style={styles.solutionMoves}>
                                    {matchResult.puzzleSolution.map((move, index) => (
                                        <View key={index} style={styles.moveItem}>
                                            <Text style={styles.moveNumber}>{index + 1}.</Text>
                                            <Text style={styles.moveText}>{move}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {/* Badge Earned Section */}
                        {matchResult?.badgeEarned && (
                            <View style={styles.badgeSection}>
                                <View style={styles.badgeIcon}>
                                    <MaterialCommunityIcons name="medal-outline" size={48} color="#00FFA3" />
                                </View>
                                <Text style={styles.badgeTitle}>Badge Earned!</Text>
                                <Text style={styles.badgeDescription}>
                                    "{matchResult.badgeEarned.name}" - {matchResult.badgeEarned.description}
                                </Text>
                                {matchResult.badgeEarned.explorerUrl && (
                                    <TouchableOpacity
                                        style={styles.explorerLink}
                                        onPress={handleViewOnExplorer}
                                    >
                                        <Text style={styles.explorerText}>View on Explorer</Text>
                                        <Icon name="arrow-forward" size={14} color="#00FFA3" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: SPACING.lg,
        width: '100%',
    },
    modalContent: {
        backgroundColor: '#1A1A2E',
        borderRadius: 20,
        padding: SPACING.lg,
        width: '90%',
        maxWidth: 400,
        borderWidth: 2,
        borderColor: '#00FFA3',
        alignSelf: 'center',
    },
    // Victory Section
    victorySection: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    trophyIcon: {
        marginBottom: SPACING.sm,
    },
    victoryTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: getFont('bold').fontFamily,
        marginBottom: SPACING.xs,
        letterSpacing: 0.5,
    },
    victorySubtitle: {
        fontSize: FONT_SIZES.sm,
        color: '#A0A0B0',
        fontFamily: getFont('regular').fontFamily,
        textAlign: 'center',
        paddingHorizontal: SPACING.sm,
    },
    // Stats Row
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#0F0F1E',
        borderRadius: 10,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.xs,
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: getFont('bold').fontFamily,
    },
    eloValue: {
        color: '#00FFA3',
    },
    statLabel: {
        fontSize: FONT_SIZES.xs,
        color: '#A0A0B0',
        fontFamily: getFont('regular').fontFamily,
    },
    // Action Buttons
    actionButtons: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.sm + 2,
        paddingHorizontal: SPACING.xs,
        borderRadius: 10,
        gap: 6,
        minHeight: 44,
    },
    playAgainButton: {
        flex: 2,
        backgroundColor: '#9D4EDD',
    },
    homeButton: {
        flex: 1,
        backgroundColor: '#2A2A3E',
    },
    shareButton: {
        flex: 1,
        backgroundColor: '#2A2A3E',
    },
    playAgainText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: getFont('bold').fontFamily,
    },
    actionButtonText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: getFont('semiBold').fontFamily,
    },
    // Puzzle Solution Section
    solutionSection: {
        backgroundColor: '#0F0F1E',
        borderRadius: 12,
        padding: SPACING.md,
        marginBottom: SPACING.md,
    },
    solutionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.sm,
    },
    solutionTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: getFont('bold').fontFamily,
    },
    solutionMoves: {
        gap: SPACING.xs,
    },
    moveItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        gap: SPACING.sm,
    },
    moveNumber: {
        fontSize: FONT_SIZES.sm,
        color: '#A0A0B0',
        fontFamily: getFont('medium').fontFamily,
        minWidth: 20,
    },
    moveText: {
        fontSize: FONT_SIZES.sm,
        color: '#FFFFFF',
        fontFamily: getFont('regular').fontFamily,
    },
    // Badge Section
    badgeSection: {
        backgroundColor: '#0F0F1E',
        borderRadius: 12,
        padding: SPACING.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#00FFA3',
    },
    badgeIcon: {
        marginBottom: SPACING.sm,
    },
    badgeTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: getFont('bold').fontFamily,
        marginBottom: SPACING.xs,
    },
    badgeDescription: {
        fontSize: FONT_SIZES.xs,
        color: '#A0A0B0',
        fontFamily: getFont('regular').fontFamily,
        textAlign: 'center',
        marginBottom: SPACING.sm,
        paddingHorizontal: SPACING.xs,
    },
    explorerLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: SPACING.xs,
    },
    explorerText: {
        fontSize: FONT_SIZES.xs,
        color: '#00FFA3',
        fontFamily: getFont('semiBold').fontFamily,
    },
});

export default MatchEndModal;
