import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from 'lucide-react-native';
import ModalSheet from './ModalSheet';
import { useSettings } from '../contexts/SettingsContext';

const DAY_NAMES = {
  tr: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  es: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  de: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
  fr: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
  ja: ['月', '火', '水', '木', '金', '土', '日'],
};

const MONTH_NAMES = {
  tr: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  ja: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
};

export default function DatePickerModal({
  visible = false,
  onClose,
  onSelectDate,
  selectedDate,
  title,
}) {
  const { theme, isDark, language } = useSettings();

  // Parse initial selected date or default to today
  const initialDate = useMemo(() => {
    if (selectedDate && typeof selectedDate === 'string' && selectedDate.includes('-')) {
      const [y, m, d] = selectedDate.split('-').map((v) => parseInt(v, 10));
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        return new Date(y, m - 1, d);
      }
    }
    return new Date();
  }, [selectedDate]);

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [tempSelected, setTempSelected] = useState(
    selectedDate || initialDate.toISOString().split('T')[0]
  );

  // Sync when modal opens
  React.useEffect(() => {
    if (visible) {
      if (selectedDate && typeof selectedDate === 'string' && selectedDate.includes('-')) {
        const [y, m, d] = selectedDate.split('-').map((v) => parseInt(v, 10));
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          setCurrentYear(y);
          setCurrentMonth(m - 1);
          setTempSelected(selectedDate);
          return;
        }
      }
      const today = new Date();
      setCurrentYear(today.getFullYear());
      setCurrentMonth(today.getMonth());
      setTempSelected(today.toISOString().split('T')[0]);
    }
  }, [visible, selectedDate]);

  const todayStr = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Monday is 0, Sunday is 6
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day) => {
    const m = String(currentMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const dateStr = `${currentYear}-${m}-${d}`;
    setTempSelected(dateStr);
  };

  const handleConfirm = () => {
    if (onSelectDate) {
      onSelectDate(tempSelected);
    }
    if (onClose) onClose();
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setTempSelected(todayStr);
  };

  const dayHeaders = DAY_NAMES[language] || DAY_NAMES.tr;
  const monthName = (MONTH_NAMES[language] || MONTH_NAMES.tr)[currentMonth];
  const monthYearLabel = language === 'ja' ? `${currentYear}年 ${monthName}` : `${monthName} ${currentYear}`;

  const defaultTitle = {
    tr: 'Tarih Seç',
    en: 'Select Date',
    es: 'Seleccionar Fecha',
    de: 'Datum Auswählen',
    fr: 'Choisir la Date',
    ja: '日付を選択',
  }[language] || 'Tarih Seç';

  const todayLabel = {
    tr: 'Bugün',
    en: 'Today',
    es: 'Hoy',
    de: 'Heute',
    fr: "Aujourd'hui",
    ja: '今日',
  }[language] || 'Bugün';

  const confirmLabel = {
    tr: 'Seçimi Onayla',
    en: 'Confirm Selection',
    es: 'Confirmar',
    de: 'Bestätigen',
    fr: 'Confirmer',
    ja: '決定',
  }[language] || 'Seçimi Onayla';

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title={title || defaultTitle}
      subtitle={tempSelected}
      theme={theme}
    >
      <View style={styles.container}>
        {/* Month Navigation */}
        <View style={styles.navRow}>
          <Pressable
            onPress={handlePrevMonth}
            style={({ pressed }) => [
              styles.navBtn,
              { backgroundColor: isDark ? '#27272A' : '#F4F4F5' },
              pressed && { opacity: 0.7 },
            ]}
          >
            <ChevronLeft size={18} color={theme.textPrimary} strokeWidth={2.2} />
          </Pressable>

          <Text style={[styles.monthYearText, { color: theme.textPrimary }]}>
            {monthYearLabel}
          </Text>

          <Pressable
            onPress={handleNextMonth}
            style={({ pressed }) => [
              styles.navBtn,
              { backgroundColor: isDark ? '#27272A' : '#F4F4F5' },
              pressed && { opacity: 0.7 },
            ]}
          >
            <ChevronRight size={18} color={theme.textPrimary} strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* Day of Week Headers */}
        <View style={styles.daysHeaderRow}>
          {dayHeaders.map((dh, idx) => (
            <View key={idx} style={styles.dayHeaderCell}>
              <Text style={[styles.dayHeaderText, { color: theme.textMuted }]}>
                {dh}
              </Text>
            </View>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {/* Empty cells before 1st of the month */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <View key={`empty-${idx}`} style={styles.dayCell} />
          ))}

          {/* Days of current month */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const m = String(currentMonth + 1).padStart(2, '0');
            const d = String(dayNum).padStart(2, '0');
            const cellDateStr = `${currentYear}-${m}-${d}`;

            const isSelected = tempSelected === cellDateStr;
            const isToday = todayStr === cellDateStr;

            return (
              <Pressable
                key={`day-${dayNum}`}
                onPress={() => handleSelectDay(dayNum)}
                style={({ pressed }) => [
                  styles.dayCell,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <View
                  style={[
                    styles.dayCircle,
                    isToday && [
                      styles.todayCircle,
                      { borderColor: isDark ? '#52525B' : '#A1A1AA' },
                    ],
                    isSelected && [
                      styles.selectedDayCircle,
                      {
                        backgroundColor: theme.btnPrimaryBg,
                      },
                    ],
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: theme.textPrimary },
                      isToday && { fontWeight: '700' },
                      isSelected && {
                        color: theme.btnPrimaryText,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {dayNum}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Bottom Actions */}
        <View style={styles.footerRow}>
          <Pressable
            onPress={handleToday}
            style={({ pressed }) => [
              styles.todayBtn,
              { backgroundColor: isDark ? '#27272A' : '#F4F4F5' },
              pressed && { opacity: 0.8 },
            ]}
          >
            <CalendarIcon size={14} color={theme.textPrimary} strokeWidth={2} />
            <Text style={[styles.todayBtnText, { color: theme.textPrimary }]}>
              {todayLabel}
            </Text>
          </Pressable>

          <Pressable
            onPress={handleConfirm}
            style={({ pressed }) => [
              styles.confirmBtn,
              { backgroundColor: theme.btnPrimaryBg },
              pressed && { opacity: 0.88 },
            ]}
          >
            <Check size={15} color={theme.btnPrimaryText} strokeWidth={2.4} />
            <Text style={[styles.confirmBtnText, { color: theme.btnPrimaryText }]}>
              {confirmLabel}
            </Text>
          </Pressable>
        </View>
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 14,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthYearText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  daysHeaderRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayHeaderText: {
    fontSize: 11,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircle: {
    borderWidth: 1.5,
  },
  selectedDayCircle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  todayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  todayBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
