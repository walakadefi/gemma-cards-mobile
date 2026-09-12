import { useEffect, useRef, useState } from 'react';
import { Animated, StyleProp, TextStyle } from 'react-native';

import { formatEuro } from '../../domain/catalog';

export const collectionValueA11yLabel = (valueCents: number): string => `Animated collection value ${formatEuro(valueCents)}`;

export function AnimatedCollectionValue({ valueCents, style }: { valueCents: number; style?: StyleProp<TextStyle> }) {
  const value = useRef(new Animated.Value(valueCents)).current;
  const [displayCents, setDisplayCents] = useState(valueCents);

  useEffect(() => {
    const listener = value.addListener(({ value: next }) => setDisplayCents(Math.round(next)));
    const animation = Animated.timing(value, { toValue: valueCents, duration: 650, useNativeDriver: false });
    animation.start();
    return () => { animation.stop(); value.removeListener(listener); };
  }, [value, valueCents]);

  return <Animated.Text accessibilityLabel={collectionValueA11yLabel(valueCents)} style={style}>{formatEuro(displayCents)}</Animated.Text>;
}
