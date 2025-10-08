import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { getFont } from '../../utils/typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types';

type LeaderboardScreenProps = {
    navigation: NativeStackNavigationProp<MainStackParamList, 'Leaderboard'>;
};

interface LeaderboardEntry {
    rank: number;
    username: string;
    wins: number;
    avgTime: string;
    elo: number;
    isCurrentUser?: boolean;
}

// Mock data - will be replaced with real data later
const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, username: 'ChessMaster99', wins: 45, avgTime: '12.3s', elo: 2450 },
    { rank: 2, username: 'PuzzleKing', wins: 42, avgTime: '13.1s', elo: 2380 },
    { rank: 3, username: 'QuickSolver', wins: 38, avgTime: '14.5s', elo: 2310 },
    { rank: 4, username: 'TacticsPro', wins: 35, avgTime: '15.2s', elo: 2250 },
    { rank: 5, username: 'BlitzChess', wins: 32, avgTime: '16.0s', elo: 2180 },
    { rank: 6, username: 'Player', wins: 0, avgTime: '--', elo: 1500, isCurrentUser: true },
];

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ navigation }) => {
    const [activeTab, setActiveTab] = React.useState<'weekly' | 'allTime'>('weekly');

    const getRankIcon = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `${rank}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Leaderboard</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Tab Selector */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'weekly' && styles.activeTab]}
                    onPress={() => setActiveTab('weekly')}
                >
                    <Text style={[styles.tabText, activeTab === 'weekly' && styles.activeTabText]}>
                        Weekly
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'allTime' && styles.activeTab]}
                    onPress={() => setActiveTab('allTime')}
                >
                    <Text style={[styles.tabText, activeTab === 'allTime' && styles.activeTabText]}>
                        All Time
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Leaderboard List */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.listHeader}>
                    <Text style={[styles.listHeaderText, { flex: 0.8 }]}>Rank</Text>
                    <Text style={[styles.listHeaderText, { flex: 2 }]}>Player</Text>
                    <Text style={[styles.listHeaderText, { flex: 1, textAlign: 'center' }]}>Wins</Text>
                    <Text style={[styles.listHeaderText, { flex: 1.2, textAlign: 'center' }]}>Avg Time</Text>
                    <Text style={[styles.listHeaderText, { flex: 1, textAlign: 'right' }]}>ELO</Text>
                </View>

                {mockLeaderboard.map((entry) => (
                    <View
                        key={entry.rank}
                        style={[
                            styles.leaderboardItem,
                            entry.isCurrentUser && styles.currentUserItem
                        ]}
                    >
                        <View style={[styles.rankContainer, { flex: 0.8 }]}>
                            {entry.rank <= 3 ? (
                                <Text style={styles.rankText}>{getRankIcon(entry.rank)}</Text>
                            ) : (
                                <View style={styles.rankBadge}>
                                    <Text style={styles.rankNumber}>{entry.rank}</Text>
                                </View>
                            )}
                        </View>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={[styles.avatarPlaceholder, entry.isCurrentUser && styles.currentUserAvatar]}>
                                <Icon name="person" size={16} color={entry.isCurrentUser ? COLORS.primary : COLORS.textSecondary} />
                            </View>
                            <Text
                                style={[
                                    styles.username,
                                    entry.isCurrentUser && styles.currentUserText
                                ]}
                                numberOfLines={1}
                            >
                                {entry.username}
                            </Text>
                        </View>
                        <Text style={[styles.statText, { flex: 1, textAlign: 'center' }]}>
                            {entry.wins}
                        </Text>
                        <Text style={[styles.statText, { flex: 1.2, textAlign: 'center' }]}>
                            {entry.avgTime}
                        </Text>
                        <View style={[styles.eloContainer, { flex: 1 }]}>
                            <Text style={[styles.eloText, entry.isCurrentUser && { color: COLORS.primary }]}>
                                {entry.elo}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
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
        borderBottomColor: COLORS.border || 'rgba(255, 255, 255, 0.1)',
    },
    backButton: {
        padding: SPACING.xs,
    },
    headerTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.text,
        fontFamily: getFont('bold').fontFamily,
    },
    placeholder: {
        width: 40,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: SPACING.lg,
        marginVertical: SPACING.md,
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: SPACING.sm,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        fontFamily: getFont('medium').fontFamily,
    },
    activeTabText: {
        color: COLORS.background,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
    },
    listHeader: {
        flexDirection: 'row',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border || 'rgba(255, 255, 255, 0.1)',
        marginBottom: SPACING.xs,
    },
    listHeaderText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        fontFamily: getFont('semiBold').fontFamily,
    },
    leaderboardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
        borderRadius: 12,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    currentUserItem: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        backgroundColor: `${COLORS.primary}15`,
    },
    rankContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        fontFamily: getFont('bold').fontFamily,
    },
    rankBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    rankNumber: {
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        fontFamily: getFont('bold').fontFamily,
    },
    avatarPlaceholder: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    currentUserAvatar: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    username: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text,
        fontWeight: '600',
        fontFamily: getFont('semiBold').fontFamily,
    },
    currentUserText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    statText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontFamily: getFont('regular').fontFamily,
    },
    eloContainer: {
        alignItems: 'flex-end',
    },
    eloText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.primary,
        fontWeight: 'bold',
        fontFamily: getFont('bold').fontFamily,
    },
});

export default LeaderboardScreen;
