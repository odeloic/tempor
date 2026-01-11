import { useTheme } from '@/theme/ThemeProvider';
import { Pressable, StyleSheet, Text, View, Modal } from 'react-native';
import { fonts, radii, spacing } from '@/theme/tokens';
import { useState } from 'react';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { type DateRange } from '@/hooks/useTimeEntries';

type DateRangeFilterProps = {
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
};

type PresetOption = {
  label: string;
  getValue: () => DateRange;
};

const getPresets = (): PresetOption[] => {
  const today = new Date();
  return [
    {
      label: 'Today',
      getValue: () => ({ start: today, end: today }),
    },
    {
      label: 'Yesterday',
      getValue: () => {
        const yesterday = subDays(today, 1);
        return { start: yesterday, end: yesterday };
      },
    },
    {
      label: 'This Week',
      getValue: () => ({
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      }),
    },
    {
      label: 'Last 7 Days',
      getValue: () => ({ start: subDays(today, 6), end: today }),
    },
    {
      label: 'This Month',
      getValue: () => ({
        start: startOfMonth(today),
        end: endOfMonth(today),
      }),
    },
    {
      label: 'Last 30 Days',
      getValue: () => ({ start: subDays(today, 29), end: today }),
    },
  ];
};

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const { colors } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const presets = getPresets();

  const getDisplayLabel = () => {
    if (!value) return 'All Time';
    const startStr = format(value.start, 'MMM d');
    const endStr = format(value.end, 'MMM d');
    if (startStr === endStr) return startStr;
    return `${startStr} - ${endStr}`;
  };

  const handleSelectPreset = (preset: PresetOption) => {
    onChange(preset.getValue());
    setShowModal(false);
  };

  const handleClear = () => {
    onChange(null);
    setShowModal(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setShowModal(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: value ? colors.textPrimary : 'transparent',
            borderColor: value ? 'transparent' : colors.border,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Text
          style={[
            styles.triggerText,
            { color: value ? colors.background : colors.textPrimary },
          ]}
        >
          {getDisplayLabel()}
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
          <View
            style={[
              styles.modal,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Select Date Range
            </Text>

            <View style={styles.presetList}>
              {presets.map((preset) => (
                <Pressable
                  key={preset.label}
                  onPress={() => handleSelectPreset(preset)}
                  style={({ pressed }) => [
                    styles.presetItem,
                    {
                      backgroundColor: pressed ? colors.border : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[styles.presetLabel, { color: colors.textPrimary }]}
                  >
                    {preset.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleClear}
              style={({ pressed }) => [
                styles.clearButton,
                {
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.clearText, { color: colors.textSecondary }]}>
                Clear Filter
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
  },
  triggerText: {
    fontSize: 13,
    fontFamily: fonts.sansMedium,
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
  presetList: {
    gap: spacing.xs,
  },
  presetItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  presetLabel: {
    fontSize: 15,
    fontFamily: fonts.sans,
  },
  clearButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 14,
    fontFamily: fonts.sansMedium,
  },
});
