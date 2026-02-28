import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Mediora',
  slug: 'mediora',
  scheme: 'mediora',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/logo-icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#060608',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/logo-icon.png',
      backgroundColor: '#060608',
    },
  },
  web: {
    bundler: 'metro',
    favicon: './assets/images/logo-icon.png',
  },
  extra: {
    // Legacy Google OAuth (existing)
    googleWebClientId:
      '554626334629-do7rr0hs2e6mb9lne2i0di9s5992p2rq.apps.googleusercontent.com',
    googleIosClientId: '',
    googleAndroidClientId: '',

    // AWS / API Gateway
    apiUrl:
      process.env.EXPO_PUBLIC_API_URL ??
      'https://5nkq4i9v6j.execute-api.ap-south-1.amazonaws.com',
    awsRegion: process.env.EXPO_PUBLIC_AWS_REGION ?? 'ap-south-1',
    s3Bucket: process.env.EXPO_PUBLIC_S3_BUCKET ?? 'mediora-storage',
  },
});
