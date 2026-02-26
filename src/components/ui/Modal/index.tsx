import React from 'react';
import { Modal as RNModal, View } from 'react-native';
import colors from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';

interface ModalProps {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onRequestClose,
  children,
}) => {
  return (
    <RNModal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: spacing.lg,
        }}
      >
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: '100%',
            backgroundColor: colors.background.elevated,
            borderRadius: 24,
            padding: spacing.lg,
          }}
        >
          {children}
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;

