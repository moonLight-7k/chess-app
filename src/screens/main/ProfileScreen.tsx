import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';

const ProfileScreen = () => {
  const { user } = useAuth();

  const profileSections = [
    { id: 1, title: 'Edit Profile', icon: 'person-outline' },
    { id: 2, title: 'Notifications', icon: 'notifications-outline' },
    { id: 3, title: 'Privacy', icon: 'shield-outline' },
    { id: 4, title: 'Help & Support', icon: 'help-circle-outline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
            </View>
            <Text style={styles.name}>{user?.displayName || 'User Name'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>89</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Profile Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Settings</Text>
            {profileSections.map((section) => (
              <TouchableOpacity key={section.id} style={styles.menuItem}>
                <View style={styles.menuItemLeft}>
                  <Icon name={section.icon} size={24} color={COLORS.text} />
                  <Text style={styles.menuItemText}>{section.title}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                This is your profile page. Customize this section to display user
                information, achievements, or any other relevant content for your app.
              </Text>
            </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
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
  },
  avatarText: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.xl,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
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
  card: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  cardText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default ProfileScreen;
