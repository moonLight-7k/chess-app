import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';
import { MainStackParamList } from '../../types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Profile'>;

interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut } = useAuth();

  // Mock data - will be replaced with actual data
  const chessStats = {
    puzzlesSolved: 47,
    winRate: 68,
    bestStreak: 12,
    totalMatches: 69,
    avgSolveTime: '14.3s',
    currentELO: 1500,
  };

  const nftBadges = [
    { id: 1, name: 'First Win', icon: 'trophy', color: COLORS.warning },
    { id: 2, name: '10 Win Streak', icon: 'flame', color: COLORS.error },
    { id: 3, name: 'Speed Demon', icon: 'flash', color: COLORS.secondary },
    { id: 4, name: 'Puzzle Master', icon: 'ribbon', color: COLORS.primary },
  ];

  const recentMatches = [
    { id: 1, opponent: 'ChessMaster99', result: 'win', time: '12.3s', eloChange: +15 },
    { id: 2, opponent: 'PuzzleKing', result: 'loss', time: '18.7s', eloChange: -10 },
    { id: 3, opponent: 'QuickSolver', result: 'win', time: '11.5s', eloChange: +18 },
  ];

  const profileSettings = [
    { id: 1, title: 'Wallet Settings', icon: 'wallet-outline' },
    { id: 2, title: 'Notifications', icon: 'notifications-outline' },
    { id: 3, title: 'Privacy', icon: 'shield-outline' },
    { id: 4, title: 'Help & Support', icon: 'help-circle-outline' },
  ];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            </View>
            <Text style={styles.name}>{user?.displayName || 'Player'}</Text>
            <Text style={styles.email}>{user?.email || 'Not connected'}</Text>

            {/* Wallet Address */}
            <View style={styles.walletBadge}>
              <Icon name="wallet" size={16} color={COLORS.primary} />
              <Text style={styles.walletAddress}>4Qnx...7kPm</Text>
            </View>
          </View>

          {/* Chess Stats Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chess Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Icon name="trophy" size={24} color={COLORS.warning} />
                <Text style={styles.statValue}>{chessStats.currentELO}</Text>
                <Text style={styles.statLabel}>ELO Rating</Text>
              </View>
              <View style={styles.statBox}>
                <Icon name="checkmark-circle" size={24} color={COLORS.success} />
                <Text style={styles.statValue}>{chessStats.puzzlesSolved}</Text>
                <Text style={styles.statLabel}>Puzzles Solved</Text>
              </View>
              <View style={styles.statBox}>
                <Icon name="trending-up" size={24} color={COLORS.secondary} />
                <Text style={styles.statValue}>{chessStats.winRate}%</Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>
              <View style={styles.statBox}>
                <Icon name="flame" size={24} color={COLORS.error} />
                <Text style={styles.statValue}>{chessStats.bestStreak}</Text>
                <Text style={styles.statLabel}>Best Streak</Text>
              </View>
            </View>

            {/* Additional Stats */}
            <View style={styles.additionalStats}>
              <View style={styles.additionalStatItem}>
                <Text style={styles.additionalStatLabel}>Total Matches</Text>
                <Text style={styles.additionalStatValue}>{chessStats.totalMatches}</Text>
              </View>
              <View style={styles.additionalStatItem}>
                <Text style={styles.additionalStatLabel}>Avg Solve Time</Text>
                <Text style={styles.additionalStatValue}>{chessStats.avgSolveTime}</Text>
              </View>
            </View>
          </View>

          {/* NFT Badge Collection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>NFT Badges</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.badgeGrid}>
              {nftBadges.map((badge) => (
                <View key={badge.id} style={styles.badgeCard}>
                  <View style={[styles.badgeIcon, { backgroundColor: badge.color }]}>
                    <Icon name={badge.icon} size={28} color={COLORS.background} />
                  </View>
                  <Text style={styles.badgeName}>{badge.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Matches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Matches</Text>
            {recentMatches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <View style={styles.matchLeft}>
                  <Icon
                    name={match.result === 'win' ? 'checkmark-circle' : 'close-circle'}
                    size={24}
                    color={match.result === 'win' ? COLORS.success : COLORS.error}
                  />
                  <View style={styles.matchInfo}>
                    <Text style={styles.opponentName}>vs {match.opponent}</Text>
                    <Text style={styles.matchTime}>{match.time}</Text>
                  </View>
                </View>
                <Text style={[
                  styles.eloChange,
                  { color: match.eloChange > 0 ? COLORS.success : COLORS.error }
                ]}>
                  {match.eloChange > 0 ? '+' : ''}{match.eloChange}
                </Text>
              </View>
            ))}
          </View>

          {/* Profile Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            {profileSettings.map((setting) => (
              <TouchableOpacity key={setting.id} style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Icon name={setting.icon} size={24} color={COLORS.text} />
                  <Text style={styles.menuItemText}>{setting.title}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>

            {/* Go to Settings Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <View style={styles.actionButtonLeft}>
                <Icon name="settings-outline" size={24} color={COLORS.primary} />
                <Text style={styles.actionButtonText}>App Settings</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            {/* Logout Button */}
            <TouchableOpacity
              style={[styles.actionButton, styles.logoutButton]}
              onPress={handleSignOut}
            >
              <View style={styles.actionButtonLeft}>
                <Icon name="log-out-outline" size={24} color={COLORS.error} />
                <Text style={[styles.actionButtonText, styles.logoutText]}>Sign Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.card,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  walletAddress: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  viewAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  additionalStats: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  additionalStatItem: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  additionalStatLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  additionalStatValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  badgeCard: {
    width: '47%',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
  },
  matchCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  matchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  matchInfo: {
    flex: 1,
  },
  opponentName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  matchTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  eloChange: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  menuItemText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  actionButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
  logoutButton: {
    borderColor: COLORS.error,
  },
  logoutText: {
    color: COLORS.error,
  },
});

export default ProfileScreen;
