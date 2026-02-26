# Google Sign-In (optional)

To enable "Continue with Google" on Login/Signup:

1. **Google Cloud Console**: Create an OAuth 2.0 Client ID (Web application or Android/iOS as needed for Expo).
2. **Expo**: Add your client ID to `app.json` under `expo.extra.googleWebClientId` (and `expo.ios.googleServicesFile` / Android config if using native builds).
3. **App code**: In `LoginScreen.tsx` / `SignupScreen.tsx`, replace the placeholder `onPress` with `expo-auth-session`: use `useAuthRequest` with Google's discovery document, then exchange the code for tokens and call `login(token)` with your backend-issued JWT (or use the ID token if your backend accepts it).

Until then, the button shows a "Coming soon" toast.
