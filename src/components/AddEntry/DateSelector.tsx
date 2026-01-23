import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { format, subDays, startOfDay, isToday, isYesterday } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/theme/ThemeProvider';
import { fonts, radii, spacing } from '@/theme/tokens';

import type { TFunction } from 'i18next';

type DateSelectorProps = {
  value: Date;
  onChange: (date: Date) => void;
};

function getQuickOptionLabels(t: TFunction) {
  return [
    t('date.today'),
    t('date.yesterday'),
    t('date.daysAgo', { count: 2 }),
    t('date.daysAgo', { count: 3 }),
    t('date.daysAgo', { count: 4 }),
    t('date.daysAgo', { count: 5 }),
    t('date.daysAgo', { count: 6 }),
    t('date.weekAgo'),
  ];
}

function getDisplayLabel(date: Date, t: TFunction): string {
  if (isToday(date)) return t('date.today');
  if (isYesterday(date)) return t('date.yesterday');
  return format(date, 'EEE, MMM d');
}

function getOptionBackgroundColor(
  isSelected: boolean,
  isPressed: boolean,
  colors: { textPrimary: string; border: string }
): string {
  if (isSelected) return colors.textPrimary;
  if (isPressed) return colors.border;
  return 'transparent';
}

export function DateSelector({ value, onChange }: DateSelectorProps) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const today = startOfDay(new Date());
  const valueTime = startOfDay(value).getTime();
  const quickOptionLabels = getQuickOptionLabels(t);

  function handleSelectDate(daysAgo: number): void {
    onChange(subDays(today, daysAgo));
    setShowModal(false);
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{t('form.date')}</Text>
      <Pressable
        onPress={() => setShowModal(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text style={[styles.triggerText, { color: colors.textPrimary }]}>
          {getDisplayLabel(value, t)}
        </Text>
      </Pressable>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setShowModal(false)}
        >
          <View style={[styles.modal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {t('date.selectDate')}
            </Text>

            <View style={styles.optionList}>
              {quickOptionLabels.map((label, index) => {
                const optionDate = subDays(today, index);
                const isSelected = valueTime === optionDate.getTime();

                return (
                  <Pressable
                    key={label}
                    onPress={() => handleSelectDate(index)}
                    style={({ pressed }) => [
                      styles.optionItem,
                      {
                        backgroundColor: getOptionBackgroundColor(
                          isSelected,
                          pressed,
                          colors
                        ),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: isSelected
                            ? colors.background
                            : colors.textPrimary,
                        },
                      ]}
                    >
                      {label}
                    </Text>
                    <Text
                      style={[
                        styles.optionDate,
                        {
                          color: isSelected
                            ? colors.background
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      {format(optionDate, 'MMM d')}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  trigger: {
    padding: 16,
    paddingHorizontal: 18,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  triggerText: {
    fontSize: 16,
    fontFamily: fonts.sans,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 320,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: fonts.sansSemiBold,
    marginBottom: spacing.md,
  },
  optionList: {
    gap: spacing.xs,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  optionLabel: {
    fontSize: 15,
    fontFamily: fonts.sans,
  },
  optionDate: {
    fontSize: 13,
    fontFamily: fonts.sans,
  },
});
