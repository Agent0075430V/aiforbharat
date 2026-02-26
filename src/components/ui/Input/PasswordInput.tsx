import React, { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Input, { MedioraInputProps } from './index';
import colors from '../../../theme/colors';
import useHaptics from '../../../hooks/useHaptics';

export const PasswordInput: React.FC<MedioraInputProps> = (props) => {
  const [secure, setSecure] = useState(true);
  const haptics = useHaptics();

  const toggle = () => {
    haptics.light();
    setSecure((prev) => !prev);
  };

  return (
    <Input
      {...props}
      secureTextEntry={secure}
      rightIcon={
        <TouchableOpacity onPress={toggle} activeOpacity={0.75}>
          <Text
            style={{
              color: colors.text.secondary,
              fontSize: 12,
            }}
          >
            {secure ? 'Show' : 'Hide'}
          </Text>
        </TouchableOpacity>
      }
    />
  );
};

export default PasswordInput;

