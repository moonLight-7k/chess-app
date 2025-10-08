import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, FONT_SIZES, FONT_FAMILIES } from '../../constants/theme';
import { getFont } from '../../utils/typography';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<MainStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for Quick Match button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, []);

  const handleButtonPress = (callback: () => void) => {
    Vibration.vibrate(30);
    callback();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation Bar */}
      <Animated.View style={[styles.topNav, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress(() => {
            // TODO: Implement wallet connection
            console.log('Connect Wallet');
          })}
          accessible={true}
          accessibilityLabel="Connect wallet"
          accessibilityRole="button"
        >
          <Icon name="wallet-outline" size={24} color={COLORS.text} />
          <Text style={styles.navButtonText}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress(() => navigation.navigate('Leaderboard'))}
          accessible={true}
          accessibilityLabel="View leaderboard"
          accessibilityRole="button"
        >
          <Icon name="trophy-outline" size={24} color={COLORS.text} />
          <Text style={styles.navButtonText}>Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handleButtonPress(() => navigation.navigate('Profile'))}
          accessible={true}
          accessibilityLabel="View profile"
          accessibilityRole="button"
        >
          <Icon name="person-outline" size={24} color={COLORS.text} />
          <Text style={styles.navButtonText}>Profile</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* User Stats */}
      <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
        <View style={styles.statCard}>
          <Icon name="person-circle" size={18} color={COLORS.primary} />
          <Text style={styles.statValue}>{user?.displayName || 'Player'}</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="star" size={14} color={COLORS.warning} />
          <Text style={styles.statValue}>1500</Text>
          <Text style={styles.statLabel}>ELO</Text>
        </View>
        <View style={styles.statItem}>
          <Icon name="trophy" size={14} color={COLORS.success} />
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Choose Your Battle</Text>
          <Text style={styles.subtitle}>Select how you want to compete</Text>
        </View>

        {/* Battle Mode Cards */}
        <View style={styles.battleModeContainer}>
          {/* Quick Match */}
          <TouchableOpacity
            style={styles.quickMatchCard}
            onPress={() => navigation.navigate('Game')}
            activeOpacity={0.8}
          >
            <Icon name="people" size={40} color={COLORS.text} />
            <Text style={styles.cardTitle}>Quick Match</Text>
            <Text style={styles.cardSubtitle}>Find random opponent</Text>
          </TouchableOpacity>

          {/* Challenge Friend */}
          <TouchableOpacity
            style={styles.challengeFriendCard}
            activeOpacity={0.8}
            disabled
          >
            <Icon name="person" size={40} color={COLORS.text} />
            <Text style={styles.cardTitleDisabled}>Challenge Friend</Text>
            <Text style={styles.cardSubtitleDisabled}>Coming Soon</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Section - Wallet & Rank */}
      <View style={styles.bottomSection}>
        <View style={styles.walletSection}>
          <Text style={styles.walletLabel}>Connect Wallet</Text>
          <Text style={styles.walletAddress}>7xKX...9Zqw</Text>
        </View>
        <View style={styles.rankSection}>
          <Text style={styles.rankLabel}>Your Rank</Text>
          <Text style={styles.rankValue}>#47</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    alignItems: 'center',
    padding: SPACING.sm,
  },
  navButtonText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    marginTop: SPACING.xs,
    fontFamily: FONT_FAMILIES.regular,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  mainTitle: {
    fontSize: FONT_SIZES.xl + 2,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: getFont('bold').fontFamily,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontFamily: getFont('regular').fontFamily,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border || 'rgba(255, 255, 255, 0.1)',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: SPACING.xs,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  statItem: {
    flex: 0.7,
    backgroundColor: COLORS.card,
    padding: SPACING.xs,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statValue: {
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: getFont('bold').fontFamily,
  },
  statLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    fontFamily: getFont('regular').fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  battleModeContainer: {
    flexDirection: 'column',
    gap: SPACING.sm,
    width: '100%',
  },
  quickMatchCard: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  challengeFriendCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    borderWidth: 1,
    borderColor: COLORS.border,
    opacity: 0.6,
    marginTop: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: getFont('bold').fontFamily,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontFamily: getFont('regular').fontFamily,
    marginTop: SPACING.xs,
    textAlign: 'center',
    opacity: 0.9,
  },
  cardTitleDisabled: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: getFont('bold').fontFamily,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  cardSubtitleDisabled: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontFamily: getFont('regular').fontFamily,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  bottomSection: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border || 'rgba(255, 255, 255, 0.1)',
  },
  walletSection: {
    flex: 1,
  },
  walletLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontFamily: getFont('regular').fontFamily,
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontFamily: getFont('medium').fontFamily,
  },
  rankSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rankLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontFamily: getFont('regular').fontFamily,
    marginBottom: 4,
  },
  rankValue: {
    fontSize: FONT_SIZES.xl + 4,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: getFont('bold').fontFamily,
  },
});

export default HomeScreen;
