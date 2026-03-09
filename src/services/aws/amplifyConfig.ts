/**
 * amplifyConfig.ts
 * Initializes AWS Amplify v6 at app startup.
 *
 * IMPORTANT: Uses USER_PASSWORD_AUTH flow (not SRP) to avoid the
 * react-native-get-random-values crypto polyfill issue in Expo Go.
 * SRP requires crypto.getRandomValues which is unreliable in Expo Go.
 * USER_PASSWORD_AUTH sends credentials directly over HTTPS (TLS-secured).
 *
 * To enable USER_PASSWORD_AUTH in AWS Console:
 *   Cognito → User Pool → App clients → your client → Edit
 *   → Enable "ALLOW_USER_PASSWORD_AUTH" → Save
 */

import { Amplify } from 'aws-amplify';

let _configured = false;

export function configureAmplify(): void {
    if (_configured) return;

    Amplify.configure({
        Auth: {
            Cognito: {
                userPoolId: 'ap-south-1_4KrftyESC',
                userPoolClientId: '722f2bn5n8lkp6hcmvm4s89g9l',
                signUpVerificationMethod: 'code',
                loginWith: {
                    email: true,
                },
            },
        },
    });

    _configured = true;
}
