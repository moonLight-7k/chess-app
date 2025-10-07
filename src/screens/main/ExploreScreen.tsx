import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../constants/theme';

const ExploreScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover new content</Text>

          {/* Placeholder Content - Easy to customize */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <View style={styles.categoriesContainer}>
              <View style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>🎯</Text>
                <Text style={styles.categoryLabel}>Category 1</Text>
              </View>
              <View style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>🚀</Text>
                <Text style={styles.categoryLabel}>Category 2</Text>
              </View>
              <View style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>💡</Text>
                <Text style={styles.categoryLabel}>Category 3</Text>
              </View>
              <View style={styles.categoryCard}>
                <Text style={styles.categoryEmoji}>⭐</Text>
                <Text style={styles.categoryLabel}>Category 4</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending</Text>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.listItem}>
                <View style={styles.listItemIcon}>
                  <Text style={styles.listItemEmoji}>📱</Text>
                </View>
                <View style={styles.listItemContent}>
                  <Text style={styles.listItemTitle}>Trending Item {item}</Text>
                  <Text style={styles.listItemSubtitle}>
                    Add your content description here
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                This section can display recommended content based on user
                preferences or behavior. Customize this to fit your app's needs.
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
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
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
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  categoryCard: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    width: '47%',
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: SPACING.sm,
  },
  categoryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  listItemIcon: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.background,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  listItemEmoji: {
    fontSize: 24,
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  listItemSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
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

export default ExploreScreen;
