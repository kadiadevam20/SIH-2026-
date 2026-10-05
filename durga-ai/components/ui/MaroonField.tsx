import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { useApp } from '@/context/AppContext';

type Props = Omit<TextInputProps, 'onChange' | 'onChangeText' | 'value'> & {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
};

/** Maroon pill input from Canva UI design */
export function MaroonField({ value, onChangeText, placeholder, style, ...rest }: Props) {
  const { theme } = useApp();
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.88)"
      autoCapitalize="none"
      style={[styles.field, { backgroundColor: theme.primary, color: '#fff' }, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  field: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 24,
    fontSize: 15,
    textAlign: 'center',
  },
});
