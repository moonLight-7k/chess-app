import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../types';
import { COLORS, SPACING, FONT_SIZES, FONT_FAMILIES } from '../../constants/theme';
import { getFont, typography } from '@/utils/typography';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const [connecting, setConnecting] = useState(false);

  const handleConnectWallet = async (walletType: 'phantom' | 'backpack') => {
    setConnecting(true);
    try {
      // TODO: Implement actual wallet connection
      // For now, simulate connection and navigate to main app
      await new Promise(resolve => setTimeout(resolve, 1500));
      Alert.alert(
        'Wallet Connected',
        `Successfully connected to ${walletType === 'phantom' ? 'Phantom' : 'Backpack'} wallet!`,
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('SignUp'), // Will be replaced with proper navigation after auth setup
          },
        ]
      );
    } catch (error) {
      Alert.alert('Connection Failed', 'Failed to connect wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Chess Branding */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="extension-puzzle" size={80} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Chess Puzzle Racing</Text>
          <Text style={styles.subtitle}>
            Connect your wallet to compete in real-time puzzle races
          </Text>
          <Text style={styles.description}>
            Solve puzzles faster than your opponent, earn rewards, and climb the leaderboard
          </Text>
        </View>

        {/* Wallet Connection Buttons */}
        <View style={styles.buttonContainer}>
          <Text style={styles.connectLabel}>Connect Wallet</Text>

          <TouchableOpacity
            style={[styles.walletButton, styles.phantomButton]}
            onPress={() => handleConnectWallet('phantom')}
            disabled={connecting}
          >
            <View style={styles.walletIconContainer}>
              <Icon name="wallet" size={24} color="#AB9FF2" />
            </View>
            <Text style={styles.walletButtonText}>Phantom Wallet</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.walletButton, styles.backpackButton]}
            onPress={() => handleConnectWallet('backpack')}
            disabled={connecting}
          >
            <View style={styles.walletIconContainer}>
              <Icon name="wallet" size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.walletButtonText}>Backpack Wallet</Text>
            <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Temporary Login Option (Remove after wallet integration) */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
            disabled={connecting}
          >
            <Text style={styles.secondaryButtonText}>
              Continue with Email (Dev Mode)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Footer */}
        <View style={styles.footer}>
          <Icon name="shield-checkmark" size={20} color={COLORS.success} />
          <Text style={styles.footerText}>
            Secure Web3 authentication via Solana blockchain
          </Text>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: SPACING.xl,
    padding: SPACING.lg,
    backgroundColor: COLORS.card,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.xxl + 4,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
    fontFamily: FONT_FAMILIES.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    fontFamily: FONT_FAMILIES.medium,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    fontFamily: FONT_FAMILIES.regular,
    lineHeight: 20,
  },
  buttonContainer: {
    gap: SPACING.md,
  },
  connectLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    fontFamily: FONT_FAMILIES.bold,
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  phantomButton: {
    borderColor: '#AB9FF2',
  },
  backpackButton: {
    borderColor: COLORS.secondary,
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletButtonText: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    fontFamily: FONT_FAMILIES.semiBold,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.sm,
  },
  secondaryButtonText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    fontFamily: FONT_FAMILIES.medium,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.lg,
  },
  footerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILIES.regular,
  },
});

export default WelcomeScreen;
