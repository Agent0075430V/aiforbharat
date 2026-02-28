import React from 'react';
import { MedioraInputProps } from './index';
import Input from './index';

export const TextArea: React.FC<MedioraInputProps> = (props) => {
  return (
    <Input
      {...props}
      multiline
      numberOfLines={props.numberOfLines ?? 4}
      style={[props.style, { textAlignVertical: 'top' }]}
    />
  );
};

export default TextArea;

