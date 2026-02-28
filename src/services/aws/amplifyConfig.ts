/**
 * amplifyConfig.ts
 * Initializes AWS Amplify once at app startup.
 * Import and call `configureAmplify()` in your root _layout.tsx or App.tsx.
 */

import { Amplify } from 'aws-amplify';
import amplifyconfig from '../../../amplifyconfiguration.json';

let _configured = false;

export function configureAmplify(): void {
    if (_configured) return;
    Amplify.configure(amplifyconfig);
    _configured = true;
}
