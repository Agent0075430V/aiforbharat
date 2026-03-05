import React from 'react';
import { TextInputProps } from 'react-native';
import Input, { MedioraInputProps } from './index';
import colors from '../../../theme/colors';

interface SearchInputProps extends Omit<MedioraInputProps, 'leftIcon'> {
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps & TextInputProps> = ({
  onClear,
  value,
  ...rest
}) => {
  const showClear = typeof value === 'string' && value.length > 0;

  return (
    <Input
      {...rest}
      value={value}
      leftIcon={
        <TextIcon
          value="🔍"
          color={colors.text.muted}
        />
      }
      rightIcon={
        showClear ? (
          <TextIcon
            value="✕"
            color={colors.text.muted}
            onPress={onClear}
          />
        ) : undefined
      }
    />
  );
};

const TextIcon: React.FC<{
  value: string;
  color: string;
  onPress?: () => void;
}> = ({ value, color, onPress }) => {
  if (onPress) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <TextIconPressable onPress={onPress}>
        <TextIconLabel value={value} color={color} />
      </TextIconPressable>
    );
  }

  return <TextIconLabel value={value} color={color} />;
};

import { Pressable, Text } from 'react-native';

const TextIconPressable: React.FC<{ onPress: () => void; children: React.ReactNode }> = ({
  onPress,
  children,
}) => (
  <Pressable onPress={onPress} hitSlop={8}>
    {children}
  </Pressable>
);

const TextIconLabel: React.FC<{ value: string; color: string }> = ({
  value,
  color,
}) => (
  <Text
    // eslint-disable-next-line react-native/no-inline-styles
    style={{ color, fontSize: 14 }}
  >
    {value}
  </Text>
);

export default SearchInput;

