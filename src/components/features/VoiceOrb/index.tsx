import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  View,
  PressableProps,
} from 'react-native';
import { styles } from './VoiceOrb.styles';
import { gradients } from '../../../theme/gradients';
import colors from '../../../theme/colors';
import { motion } from '../../../theme/animations';
import useHaptics from '../../../hooks/useHaptics';
import { VoiceState } from '../../../types/voice.types';
import WaveformBars from './WaveformBars';
import OrbParticles from './OrbParticles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export interface VoiceOrbProps extends Omit<PressableProps, 'onPress'> {
  state: VoiceState;
  onPress?: () => void;
  transcriptPreview?: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  state,
  onPress,
  transcriptPreview,
  ...rest
}) => {
  const haptics = useHaptics();
  const breathe = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  const combinedScale = Animated.multiply(breathe, pressScale);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: motion.voiceOrb.maxScale,
          duration: motion.voiceOrb.durationMs / 2,
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: motion.voiceOrb.minScale,
          duration: motion.voiceOrb.durationMs / 2,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  const animatePress = (toValue: number) => {
    Animated.spring(pressScale, {
      toValue,
      useNativeDriver: true,
      friction: 6,
      tension: 180,
    }).start();
  };

  const handlePressIn = () => {
    animatePress(motion.press.scalePressed);
  };

  const handlePressOut = () => {
    animatePress(1);
  };

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const isListening = state === 'listening';
  const isProcessing = state === 'processing';
  const isResponding = state === 'responding';

  const innerBackgroundColor = (() => {
    if (isListening) return colors.teal.dim;
    if (isProcessing) return colors.gold.glow;
    if (isResponding) return colors.teal.glow;
    return colors.background.base;
  })();

  const subtitleText = (() => {
    switch (state) {
      case 'listening':
        return "I'm listening...";
      case 'processing':
        return 'Working on it...';
      case 'responding':
        return 'Here’s what I found.';
      case 'idle':
      default:
        return 'Hey Mediora';
    }
  })();

  const hintText = (() => {
    switch (state) {
      case 'idle':
        return 'Tap to speak';
      case 'listening':
        return 'Say anything about content, calendar, brands, or analytics.';
      case 'processing':
        return 'Thinking through your request.';
      case 'responding':
        return 'Speaking back your results.';
      default:
        return undefined;
    }
  })();

  return (
    <View style={styles.container}>
      <AnimatedPressable
        {...rest}
        activeOpacity={0.75}
        style={[styles.orbPressable, { transform: [{ scale: combinedScale }] }]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <Animated.View style={styles.outerRing}>
          <Animated.View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              width: styles.outerRing.width,
              height: styles.outerRing.height,
              borderRadius: (styles.outerRing.width as number) / 2,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnimatedLinearGradient />
          </Animated.View>
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={[styles.innerOrb, { backgroundColor: innerBackgroundColor }]}
          >
            <Text style={styles.monogram}>M</Text>
            <WaveformBars active={isListening} />
            <OrbParticles
              visible={isProcessing}
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                position: 'absolute',
                width: '120%',
                height: '120%',
              }}
            />
          </View>
        </Animated.View>
      </AnimatedPressable>

      <Text style={styles.subtitle}>{subtitleText}</Text>
      {hintText ? <Text style={styles.hint}>{hintText}</Text> : null}

      {transcriptPreview ? (
        <View style={styles.transcriptCard}>
          <Text style={styles.transcriptLabel}>You said</Text>
          <Text numberOfLines={3} style={styles.transcriptText}>
            {transcriptPreview}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const AnimatedLinearGradient: React.FC = () => {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 7000,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rotate]);

  const rotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 999,
        transform: [{ rotate: rotation }],
        backgroundColor: colors.background.base,
        borderWidth: 4,
        borderColor: 'transparent',
      }}
    >
      {/* We approximate a rotating gradient ring using border + overlay */}
      {/* For a richer effect, this can be replaced with SVG or masked gradients later */}
    </Animated.View>
  );
};

export default VoiceOrb;

