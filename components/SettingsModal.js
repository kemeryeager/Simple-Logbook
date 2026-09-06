import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import {
  Moon,
  Sun,
  Smartphone,
  Globe,
  Check,
  Palette,
} from 'lucide-react-native';
import ModalSheet from './ModalSheet';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsModal({ visible = false, onClose }) {
  const {
    themeMode,
    theme,
    isDark,
    setTheme,
    language,
    setLanguage,
    t,
    languages,
  } = useSettings();

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

          {/* 3-Way Segmented Theme Picker (Light / Dark / Auto) */}
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
                themeMode === 'light' && [
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
                size={15}
                color={themeMode === 'light' ? '#D97706' : theme.textMuted}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  {
                    color: themeMode === 'light' ? theme.textPrimary : theme.textMuted,
                    fontWeight: themeMode === 'light' ? '700' : '500',
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
                themeMode === 'dark' && [
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
                size={15}
                color={themeMode === 'dark' ? '#818CF8' : theme.textMuted}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  {
                    color: themeMode === 'dark' ? theme.textPrimary : theme.textMuted,
                    fontWeight: themeMode === 'dark' ? '700' : '500',
                  },
                ]}
              >
                {t('darkMode')}
              </Text>
            </Pressable>

            {/* Auto / System Mode Tab */}
            <Pressable
              onPress={() => setTheme('system')}
              style={({ pressed }) => [
                styles.segmentButton,
                themeMode === 'system' && [
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
              <Smartphone
                size={15}
                color={themeMode === 'system' ? '#10B981' : theme.textMuted}
                strokeWidth={2.2}
              />
              <Text
                style={[
                  styles.segmentButtonText,
                  {
                    color: themeMode === 'system' ? theme.textPrimary : theme.textMuted,
                    fontWeight: themeMode === 'system' ? '700' : '500',
                  },
                ]}
              >
                {t('autoMode')}
              </Text>
            </Pressable>
          </View>

          {/* System Theme Informative Note when Auto is selected */}
          {themeMode === 'system' && (
            <View
              style={[
                styles.systemNoticeBox,
                {
                  backgroundColor: theme.cardMuted,
                  borderColor: theme.border,
                },
              ]}
            >
              <Smartphone size={13} color={theme.textMuted} strokeWidth={2} />
              <Text style={[styles.systemNoticeText, { color: theme.textMuted }]}>
                {t('autoModeDesc')} • {isDark ? t('darkMode') : t('lightMode')} {t('active').toLowerCase()}
              </Text>
            </View>
          )}
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

          {/* Language Cards Grid (6 languages) */}
          <View style={styles.languagesGrid}>
            {languages.map((langItem) => {
              const isActive = language === langItem.code;
              return (
                <Pressable
                  key={langItem.code}
                  onPress={() => setLanguage(langItem.code)}
                  style={({ pressed }) => [
                    styles.langCard,
                    {
                      backgroundColor: isActive
                        ? (isDark ? '#27272A' : '#F4F4F5')
                        : theme.card,
                      borderColor: isActive
                        ? theme.textPrimary
                        : theme.border,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={styles.langFlag}>{langItem.flag}</Text>
                  <View style={styles.langTextCol}>
                    <Text
                      style={[
                        styles.langName,
                        {
                          color: theme.textPrimary,
                          fontWeight: isActive ? '700' : '500',
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {langItem.nativeName}
                    </Text>
                    <Text
                      style={[
                        styles.langCode,
                        { color: theme.textMuted },
                      ]}
                    >
                      {langItem.name}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.checkCircle,
                      {
                        backgroundColor: isActive
                          ? theme.textPrimary
                          : 'transparent',
                        borderColor: isActive
                          ? theme.textPrimary
                          : theme.border,
                      },
                    ]}
                  >
                    {isActive ? (
                      <Check
                        size={11}
                        color={isDark ? '#09090B' : '#FFFFFF'}
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
    marginBottom: 22,
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

  // 3-way Segmented control
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    gap: 4,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 9,
    gap: 6,
  },
  segmentButtonActive: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentButtonText: {
    fontSize: 12,
    letterSpacing: -0.2,
  },
  systemNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 8,
  },
  systemNoticeText: {
    fontSize: 11,
    fontWeight: '500',
  },

  // Languages Grid
  languagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  langCard: {
    width: '48.5%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  langFlag: {
    fontSize: 20,
    marginRight: 10,
  },
  langTextCol: {
    flex: 1,
  },
  langName: {
    fontSize: 13,
    letterSpacing: -0.2,
  },
  langCode: {
    fontSize: 11,
    marginTop: 1,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom action
  closeBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
