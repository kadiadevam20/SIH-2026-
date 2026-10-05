import { StyleSheet, View } from 'react-native';

type Props = {
  color: string;
  size?: number;
};

/** Static status dot — no continuous animation (keeps UI smooth). */
export function LivingPulse({ color, size = 14 }: Props) {
  const core = size * 0.55;
  return (
    <View style={{ width: size * 2.6, height: size * 2.6, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={[
          styles.ring,
          {
            width: size * 1.55,
            height: size * 1.55,
            borderRadius: size,
            backgroundColor: color,
            opacity: 0.22,
          },
        ]}
      />
      <View style={[styles.core, { width: core, height: core, borderRadius: core, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  ring: { position: 'absolute' },
  core: {},
});
