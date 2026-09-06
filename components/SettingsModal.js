import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import {
  Moon,
  Sun,
  Globe,
  Check,
  Palette,
  Sparkles,
} from 'lucide-react-native';
import ModalSheet from './ModalSheet';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsModal({ visible = false, onClose }) {
  const {
    themeMode,
    theme,
    isDark,
    toggleTheme,
    setTheme,
    language,
    setLanguage,
    t,
    languages,
  } = useSettings();

  // Animated slider for custom modern switch (0 to 22)
  const switchAnim = useRef(new Animated.Value(isDark ? 22 : 2)).current;

  useEffect(() => {
    Animated.spring(switchAnim, {
      toValue: isDark ? 22 : 2,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [isDark]);

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title={t('settings')}
      subtitle={t('settingsSubtitle')}
      theme={theme}
    >
      <View style={styles.contentContainer}>
        {/* ================= SECTION 1: APPEARANCE / GÖRÜNÜM ================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionIconBadge,
                { backgroundColor: isDark ? '#27272A' : '#F4F4F5' },
              ]}
            >
              <Palette
                size={16}
                color={theme.textPrimary}
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.sectionTitleCol}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.textPrimary },
                ]}
              >
                {t('appearance')}
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.textMuted },
                ]}
              >
                {t('appearanceDesc')}
              </Text>
            </View>
          </View>

          {/* Segmented Theme Picker (Light / Dark) */}
          <View
            style={[
              styles.segmentedContainer,
              {
                backgroundColor: theme.cardMuted,
                borderColor: theme.border,
              },
            ]}
          >
            {/* Light Mode Tab */}
            <Pressable
              onPress={() => setTheme('light')}
              style={({ pressed }) => [
                styles.segmentButton,
                !isDark && [
                  styles.segmentButtonActive,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    shadowColor: '#000000',
                  },
                ],
                pressed && { opacity: 0.8 },
              ]}
            >
              <Sun
                size={16}
                color={!isDark ? '#D97706' : theme.textMuted}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  {
                    color: !isDark ? theme.textPrimary : theme.textMuted,
                    fontWeight: !isDark ? '700' : '500',
                  },
                ]}
              >
                {t('lightMode')}
              </Text>
            </Pressable>

            {/* Dark Mode Tab */}
            <Pressable
              onPress={() => setTheme('dark')}
              style={({ pressed }) => [
                styles.segmentButton,
                isDark && [
                  styles.segmentButtonActive,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    shadowColor: '#000000',
                  },
                ],
                pressed && { opacity: 0.8 },
              ]}
            >
              <Moon
                size={16}
                color={isDark ? '#A78BFA' : theme.textMuted}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  {
                    color: isDark ? theme.textPrimary : theme.textMuted,
                    fontWeight: isDark ? '700' : '500',
                  },
                ]}
              >
                {t('darkMode')}
              </Text>
            </Pressable>
          </View>

          {/* Interactive Dark Mode Switch Card */}
          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
              styles.toggleCard,
              {
                backgroundColor: theme.cardMuted,
                borderColor: isDark ? '#3F3F46' : theme.border,
              },
              pressed && { opacity: 0.9 },
            ]}
          >
            <View style={styles.toggleCardLeft}>
              <View
                style={[
                  styles.modeIconCircle,
                  {
                    backgroundColor: isDark ? '#27272A' : '#FEF3C7',
                  },
                ]}
              >
                {isDark ? (
                  <Moon size={18} color="#A78BFA" strokeWidth={2.2} />
                ) : (
                  <Sun size={18} color="#D97706" strokeWidth={2.2} />
                )}
              </View>
              <View style={styles.toggleCardTextCol}>
                <Text
                  style={[
                    styles.toggleCardTitle,
                    { color: theme.textPrimary },
                  ]}
                >
                  {t('darkMode')}
                </Text>
                <Text
                  style={[
                    styles.toggleCardDesc,
                    { color: theme.textMuted },
                  ]}
                >
                  {t('darkModeDesc')}
                </Text>
              </View>
            </View>

            {/* Modern Capsule Switch */}
            <View
              style={[
                styles.switchTrack,
                {
                  backgroundColor: isDark
                    ? theme.btnPrimaryBg
                    : theme.border,
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.switchThumb,
                  {
                    backgroundColor: isDark
                      ? theme.btnPrimaryText
                      : '#FFFFFF',
                    transform: [{ translateX: switchAnim }],
                  },
                ]}
              >
                {isDark ? (
                  <Moon size={11} color={theme.btnPrimaryBg} strokeWidth={2.4} />
                ) : (
                  <Sun size={11} color="#D97706" strokeWidth={2.4} />
                )}
              </Animated.View>
            </View>
          </Pressable>
        </View>

        {/* ================= SECTION 2: LANGUAGE / DİL ================= */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.sectionIconBadge,
                { backgroundColor: isDark ? '#27272A' : '#F4F4F5' },
              ]}
            >
              <Globe
                size={16}
                color={theme.textPrimary}
                strokeWidth={2.2}
              />
            </View>
            <View style={styles.sectionTitleCol}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.textPrimary },
                ]}
              >
                {t('language')}
              </Text>
              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.textMuted },
                ]}
              >
                {t('languageDesc')}
              </Text>
            </View>
          </View>

          {/* 6 Languages Grid (2 columns x 3 rows) */}
          <View style={styles.languageGrid}>
            {languages.map((item) => {
              const isActive = language === item.code;
              return (
                <Pressable
                  key={item.code}
                  onPress={() => setLanguage(item.code)}
                  style={({ pressed }) => [
                    styles.langCard,
                    {
                      backgroundColor: isActive
                        ? isDark
                          ? '#27272A'
                          : '#FFFFFF'
                        : theme.cardMuted,
                      borderColor: isActive
                        ? theme.btnPrimaryBg
                        : theme.borderMuted,
                      borderWidth: isActive ? 1.8 : 1,
                    },
                    isActive && styles.langCardActiveShadow,
                    pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <View style={styles.langCardContent}>
                    <Text style={styles.flagEmoji}>{item.flag}</Text>
                    <View style={styles.langTextCol}>
                      <Text
                        style={[
                          styles.langNativeName,
                          {
                            color: isActive
                              ? theme.textPrimary
                              : theme.textSecondary,
                            fontWeight: isActive ? '700' : '600',
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {item.nativeName}
                      </Text>
                      <Text
                        style={[
                          styles.langSubName,
                          { color: theme.textMuted },
                        ]}
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                    </View>
                  </View>

                  {/* Active Indicator Badge */}
                  <View
                    style={[
                      styles.indicatorCircle,
                      {
                        backgroundColor: isActive
                          ? theme.btnPrimaryBg
                          : 'transparent',
                        borderColor: isActive
                          ? theme.btnPrimaryBg
                          : theme.border,
                      },
                    ]}
                  >
                    {isActive ? (
                      <Check
                        size={11}
                        color={theme.btnPrimaryText}
                        strokeWidth={3}
                      />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ================= BOTTOM ACTION ================= */}
        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeBtn,
            {
              backgroundColor: theme.btnPrimaryBg,
            },
            pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] },
          ]}
        >
          <Text
            style={[
              styles.closeBtnText,
              { color: theme.btnPrimaryText },
            ]}
          >
            {t('done')}
          </Text>
        </Pressable>
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionTitleCol: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },

  // Segmented control
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    marginBottom: 12,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 7,
  },
  segmentButtonActive: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentButtonText: {
    fontSize: 13,
    letterSpacing: -0.2,
  },

  // Toggle card
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  toggleCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  modeIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toggleCardTextCol: {
    flex: 1,
  },
  toggleCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  toggleCardDesc: {
    fontSize: 12,
    marginTop: 2,
  },

  // Switch
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },

  // Language Grid
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  langCard: {
    width: '48.3%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 14,
  },
  langCardActiveShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  langCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  flagEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  langTextCol: {
    flex: 1,
  },
  langNativeName: {
    fontSize: 13.5,
    letterSpacing: -0.2,
  },
  langSubName: {
    fontSize: 11,
    marginTop: 1,
  },
  indicatorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Done button
  closeBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: Platform.OS === 'ios' ? 10 : 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
