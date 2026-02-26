import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  View,
  ViewStyle,
  StyleSheet,
  Dimensions,
} from 'react-native';
import colors from '../../../theme/colors';
import { radius, spacing } from '../../../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface BottomSheetRef {
  snapToIndex: (index: number) => void;
}

export interface BottomSheetProps {
  children: React.ReactNode;
  initialIndex?: number;
  snapPoints?: (string | number)[];
  onClose?: () => void;
  style?: ViewStyle;
}

function parseSnapPoint(snap: string | number): number {
  if (typeof snap === 'number') return snap;
  const match = snap.match(/^(\d+)%$/);
  if (match) return (SCREEN_HEIGHT * Number(match[1])) / 100;
  return SCREEN_HEIGHT * 0.5;
}

export const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps>(
  (
    {
      children,
      initialIndex = 0,
      snapPoints = ['40%', '70%'],
      onClose,
      style,
    },
    ref
  ) => {
    const [visible, setVisible] = useState(initialIndex >= 0);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useImperativeHandle(ref, () => ({
      snapToIndex(index: number) {
        if (index >= 0) {
          setVisible(true);
        } else {
          setVisible(false);
          onCloseRef.current?.();
        }
      },
    }));

    const heights = snapPoints.map(parseSnapPoint);
    const sheetHeight = heights[0] ?? SCREEN_HEIGHT * 0.4;

    const handleBackdropPress = () => {
      setVisible(false);
      onCloseRef.current?.();
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleBackdropPress}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
        >
          <View style={styles.backdrop} />
        </Pressable>
        <View
          style={[styles.sheet, { height: sheetHeight }]}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.handle} />
          <View style={[styles.content, style]}>{children}</View>
        </View>
      </Modal>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background.elevated,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border.subtle,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
});

export default BottomSheet;
