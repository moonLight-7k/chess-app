import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../../types';
import { COLORS, SPACING, FONT_SIZES, FONT_FAMILIES } from '../../constants/theme';

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const { height } = Dimensions.get('window');

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../../assets/welcome.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={5}

    >
      <LinearGradient
        colors={['#0F111A', '#19F0A133']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Header Section with Logo and Title */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../../../assets/splash-icon.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.title}>Chess Duel</Text>
              <Text style={styles.subtitle}>
                Compete. Solve. Earn.
              </Text>

            </View>

            {/* Main Action Buttons */}
            <View style={styles.buttonContainer}>
              {/* Sign Up Button - Primary */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => navigation.navigate('SignUp')}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>Sign Up</Text>
                <Icon name="arrow-forward" size={20} color={COLORS.background} />
              </TouchableOpacity>

              {/* Login Button - Secondary */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>Login</Text>
              </TouchableOpacity>


            </View>


          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: SPACING.lg,
    paddingTop: height * 0.08,
    paddingBottom: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 100,
    height: 100,
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
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    fontFamily: FONT_FAMILIES.semiBold,
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
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md + 4,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    gap: SPACING.sm,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILIES.bold,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.md + 4,
    paddingHorizontal: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILIES.bold,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILIES.medium,
  },
  walletLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontFamily: FONT_FAMILIES.medium,
    marginBottom: SPACING.sm,
  },
  walletButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  walletButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  phantomButton: {
    borderColor: '#AB9FF2',
  },
  backpackButton: {
    borderColor: COLORS.secondary,
  },
  walletButtonText: {
    color: COLORS.text,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    fontFamily: FONT_FAMILIES.semiBold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.md,
  },
  footerText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILIES.regular,
  },
});

export default WelcomeScreen;
