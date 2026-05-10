import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import {
  monthWheelOptions,
  wheelItemHeight,
  yearWheelOptions,
} from "./constants";
import ModalActionRow from "./ModalActionRow";
import { searchStyles as styles } from "./styles";
import type { DateRange, WheelOption } from "./types";
import { clampDateRangeDays, formatDateLabel, getDaysInMonth } from "./utils";

type Props = {
  visible: boolean;
  value: DateRange;
  onApply: (value: DateRange) => void;
  onReset: () => void;
  onClose: () => void;
};

export default function DateRangeModal({
  visible,
  value,
  onApply,
  onReset,
  onClose,
}: Props) {
  const [draft, setDraft] = useState<DateRange>(value);
  const [activeSide, setActiveSide] = useState<"start" | "end">("start");

  useEffect(() => {
    if (visible) {
      setDraft(value);
      setActiveSide("start");
    }
  }, [value, visible]);

  const selectedDate =
    activeSide === "start"
      ? {
          year: draft.startYear,
          month: draft.startMonth,
          day: draft.startDay,
        }
      : {
          year: draft.endYear,
          month: draft.endMonth,
          day: draft.endDay,
        };

  const dayWheelOptions = Array.from(
    { length: getDaysInMonth(selectedDate.year, selectedDate.month) },
    (_, index) => {
      const day = index + 1;

      return { value: day, label: `${day}일` };
    },
  );

  const handleChange = (part: "year" | "month" | "day", value: number) => {
    setDraft((prev) => {
      const next = { ...prev };

      if (activeSide === "start") {
        if (part === "year") next.startYear = value;
        if (part === "month") next.startMonth = value;
        if (part === "day") next.startDay = value;
      } else {
        if (part === "year") next.endYear = value;
        if (part === "month") next.endMonth = value;
        if (part === "day") next.endDay = value;
      }

      return clampDateRangeDays(next);
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.datePickerSheet}>
              <Text style={styles.filterSheetTitle}>출간일 선택</Text>

              <View style={styles.dateTargetRow}>
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setActiveSide("start")}
                  style={[
                    styles.dateTargetCard,
                    activeSide === "start" && styles.dateTargetCardActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateTargetLabel,
                      activeSide === "start" && styles.dateTargetTextActive,
                    ]}
                  >
                    시작일
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.dateTargetValue,
                      activeSide === "start" && styles.dateTargetTextActive,
                    ]}
                  >
                    {formatDateLabel(
                      draft.startYear,
                      draft.startMonth,
                      draft.startDay,
                    )}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.dateRangeSeparator}>~</Text>

                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setActiveSide("end")}
                  style={[
                    styles.dateTargetCard,
                    activeSide === "end" && styles.dateTargetCardActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.dateTargetLabel,
                      activeSide === "end" && styles.dateTargetTextActive,
                    ]}
                  >
                    종료일
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.dateTargetValue,
                      activeSide === "end" && styles.dateTargetTextActive,
                    ]}
                  >
                    {formatDateLabel(
                      draft.endYear,
                      draft.endMonth,
                      draft.endDay,
                    )}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.wheelPickerWrap}>
                <View pointerEvents="none" style={styles.wheelSelectedBand} />
                <WheelColumn
                  options={yearWheelOptions}
                  value={selectedDate.year}
                  onChange={(year) => handleChange("year", year)}
                />
                <WheelColumn
                  options={monthWheelOptions}
                  value={selectedDate.month}
                  onChange={(month) => handleChange("month", month)}
                />
                <WheelColumn
                  options={dayWheelOptions}
                  value={selectedDate.day}
                  onChange={(day) => handleChange("day", day)}
                />
              </View>

              <ModalActionRow
                onReset={onReset}
                onApply={() => onApply({ ...draft, active: true })}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

type WheelColumnProps = {
  options: WheelOption[];
  value: number;
  onChange: (value: number) => void;
};

function WheelColumn({ options, value, onChange }: WheelColumnProps) {
  const listRef = useRef<FlatList<WheelOption>>(null);
  const isMomentumScrollingRef = useRef(false);
  const dragEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  const clearDragEndTimer = () => {
    if (dragEndTimerRef.current) {
      clearTimeout(dragEndTimerRef.current);
      dragEndTimerRef.current = null;
    }
  };

  const handleScrollEnd = (offsetY: number) => {
    const nextIndex = Math.max(
      0,
      Math.min(
        options.length - 1,
        Math.round(offsetY / wheelItemHeight),
      ),
    );
    const nextValue = options[nextIndex]?.value;

    if (nextValue !== undefined && nextValue !== value) {
      onChange(nextValue);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: false,
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [options.length, selectedIndex]);

  useEffect(() => {
    return () => {
      if (dragEndTimerRef.current) {
        clearTimeout(dragEndTimerRef.current);
      }
    };
  }, []);

  return (
    <FlatList
      ref={listRef}
      data={options}
      keyExtractor={(item) => String(item.value)}
      style={styles.wheelColumn}
      contentContainerStyle={styles.wheelColumnContent}
      showsVerticalScrollIndicator={false}
      snapToInterval={wheelItemHeight}
      decelerationRate="fast"
      getItemLayout={(_, index) => ({
        length: wheelItemHeight,
        offset: wheelItemHeight * index,
        index,
      })}
      onScrollToIndexFailed={({ index }) => {
        setTimeout(() => {
          listRef.current?.scrollToIndex({
            index,
            animated: false,
          });
        }, 50);
      }}
      onMomentumScrollBegin={() => {
        isMomentumScrollingRef.current = true;
        clearDragEndTimer();
      }}
      onMomentumScrollEnd={(event) => {
        isMomentumScrollingRef.current = false;
        clearDragEndTimer();
        handleScrollEnd(event.nativeEvent.contentOffset.y);
      }}
      onScrollEndDrag={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;

        clearDragEndTimer();
        dragEndTimerRef.current = setTimeout(() => {
          dragEndTimerRef.current = null;

          if (!isMomentumScrollingRef.current) {
            handleScrollEnd(offsetY);
          }
        }, 50);
      }}
      renderItem={({ item }) => {
        const active = item.value === value;

        return (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onChange(item.value)}
            style={styles.wheelItem}
          >
            <Text
              style={[styles.wheelItemText, active && styles.wheelItemActive]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}
