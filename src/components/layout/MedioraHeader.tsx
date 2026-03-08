import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import colors from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { fontFamilies, fontSizes } from '../../theme/typography';

interface MedioraHeaderProps {
  /** Title displayed in the center of the header */
  title?: string;
  /** Show a ← back button on the left. Defaults to false. */
  showBack?: boolean;
  /** Custom back press handler. If not provided, navigation.goBack() is used. */
  onBackPress?: () => void;
}

/**
 * App-wide top header:
 * – Left:   ← back button (optional)
 * – Center: "MEDIORA" brand (always links to Home tab)
 * – Right:  placeholder to keep the brand centred
 */
const MedioraHeader: React.FC<MedioraHeaderProps> = ({
  showBack = false,
  onBackPress,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleLogoPress = () => {
    // Navigate to the HomeStack tab – works from any depth in the navigator tree
    navigation.dispatch(
      CommonActions.navigate({
        name: 'HomeStack',
      })
    );
  };

  return (
    <View style={styles.container}>
      {/* Left: back button */}
      <View style={styles.side}>
        {showBack && (
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>
        )}
      </View>

      {/* Center: Mediora logo */}
      <Pressable
        onPress={handleLogoPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
      >
        <Text style={styles.logo}>MEDIORA</Text>
      </Pressable>

      {/* Right: mirror placeholder so logo stays centred */}
      <View style={styles.side} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.hair,
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS === 'ios' ? spacing.xxl : spacing.md,
    paddingBottom: spacing.sm,
    minHeight: 56,
  },
  side: {
    width: 72,            // fixed width so the center logo stays centred
    justifyContent: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backArrow: {
    fontSize: 20,
    color: colors.gold.pure,
    lineHeight: 22,
  },
  backLabel: {
    fontFamily: fontFamilies.body.medium,
    fontSize: fontSizes.sm,
    color: colors.gold.pure,
  },
  logo: {
    fontFamily: fontFamilies.heading.bold,
    fontSize: fontSizes.lg,
    letterSpacing: 3,
    color: colors.gold.pure,
    textAlign: 'center',
  },
});

export default MedioraHeader;
