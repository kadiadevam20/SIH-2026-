import { fonts } from '@/theme';
import { Text, TextProps } from 'react-native';

type Props = TextProps & {
  weight?: keyof typeof fonts;
};

export function AppText({ weight = 'regular', style, ...props }: Props) {
  return <Text {...props} style={[{ fontFamily: fonts[weight] }, style]} />;
}
