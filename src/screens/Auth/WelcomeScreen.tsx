import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/ui/Button';
import { welcomeStyles as styles } from './styles/Welcome.styles';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../types/navigation.types';

type Nav = StackNavigationProp<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <View style={styles.container}>
      <View style={styles.orbGoldLarge} />
      <View style={styles.orbTeal} />
      <View style={styles.orbGoldSmall} />

      <View style={styles.logoRow}>
        <Text style={styles.logoText}>mediora</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heading}>
          Create content{'\n'}
          that sounds like <Text style={styles.headingAccent}>you.</Text>
        </Text>
        <Text style={styles.subtext}>
          AI-powered content management for{'\n'}
          influencers who have a voice worth amplifying.
        </Text>
      </View>

      <View style={styles.bottom}>
        <Button
          title="Get Started →"
          onPress={() => navigation.navigate('Signup')}
        />
        <Text
          style={styles.secondaryCta}
          onPress={() => navigation.navigate('Login')}
        >
          I already have an account
        </Text>
      </View>
    </View>
  );
};

export default WelcomeScreen;

