import { useNavigation } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { BackHandler, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const { width: W, height: H } = Dimensions.get('window');

type DismissCtx = {
  dismiss: () => void;
  /** true while we intentionally pop after reverse animation */
  allowRemoveRef: React.MutableRefObject<boolean>;
};

const DiagonalDismissContext = createContext<DismissCtx | null>(null);

export function useDiagonalDismiss() {
  const ctx = useContext(DiagonalDismissContext);
  const navigation = useNavigation();
  return (
    ctx?.dismiss ??
    (() => {
      if (navigation.canGoBack()) navigation.goBack();
    })
  );
}

/** On settings home — intercept hardware/gesture back so reverse slide plays first */
export function useDiagonalBackInterceptor() {
  const ctx = useContext(DiagonalDismissContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!ctx) return;
    const unsub = navigation.addListener('beforeRemove', (e) => {
      if (ctx.allowRemoveRef.current) return;

      // Only hijack back/pop — never block logout replace / reset / navigate away
      const type = e.data.action.type;
      if (type !== 'GO_BACK' && type !== 'POP' && type !== 'POP_TO_TOP') {
        return;
      }

      e.preventDefault();
      ctx.dismiss();
    });
    return unsub;
  }, [ctx, navigation]);
}

type Props = {
  children: ReactNode;
  backgroundColor: string;
};

/** Full-screen: enter top-right → bottom-left; leave reverse */
export function DiagonalSlideScreen({ children, backgroundColor }: Props) {
  const navigation = useNavigation();
  const progress = useSharedValue(0);
  const closingRef = useRef(false);
  const allowRemoveRef = useRef(false);

  const finishClose = useCallback(() => {
    closingRef.current = false;
    allowRemoveRef.current = true;
    const parent = navigation.getParent();
    if (parent?.canGoBack()) {
      parent.goBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
    // reset shortly after pop
    setTimeout(() => {
      allowRemoveRef.current = false;
    }, 500);
  }, [navigation]);

  const dismiss = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    progress.value = withTiming(
      0,
      { duration: 420, easing: Easing.in(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(finishClose)();
        else closingRef.current = false;
      },
    );
  }, [finishClose, progress]);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 520,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const state = navigation.getState();
      if (state && typeof state.index === 'number' && state.index > 0) {
        return false;
      }
      dismiss();
      return true;
    });
    return () => sub.remove();
  }, [dismiss, navigation]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: interpolate(p, [0, 0.12, 1], [0, 1, 1]),
      transform: [
        { translateX: interpolate(p, [0, 1], [W * 0.72, 0]) },
        { translateY: interpolate(p, [0, 1], [-H * 0.42, 0]) },
        { scale: interpolate(p, [0, 1], [0.92, 1]) },
      ],
    };
  });

  const value = useMemo(() => ({ dismiss, allowRemoveRef }), [dismiss]);

  return (
    <DiagonalDismissContext.Provider value={value}>
      <Animated.View style={[styles.fill, { backgroundColor }, style]}>{children}</Animated.View>
    </DiagonalDismissContext.Provider>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
