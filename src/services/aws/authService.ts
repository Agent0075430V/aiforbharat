/**
 * authService.ts
 * Wraps Amplify Auth (Cognito) with typed helpers for the Mediora app.
 * All functions throw on failure — catch at the call-site.
 */

import {
    signUp as amplifySignUp,
    signIn as amplifySignIn,
    signOut as amplifySignOut,
    getCurrentUser as amplifyGetCurrentUser,
    confirmSignUp as amplifyConfirmSignUp,
    resendSignUpCode as amplifyResendSignUpCode,
    fetchUserAttributes,
    type SignUpInput,
} from 'aws-amplify/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MedioraUser {
    userId: string;
    email: string;
    name?: string;
}

export interface SignUpParams {
    email: string;
    password: string;
    name: string;
}

export interface SignInParams {
    email: string;
    password: string;
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export async function signUp({ email, password, name }: SignUpParams): Promise<void> {
    const input: SignUpInput = {
        username: email,
        password,
        options: {
            userAttributes: {
                email,
                given_name: name,   // Cognito User Pool requires 'given_name' (not 'name')
            },
        },
    };
    await amplifySignUp(input);
}

// ─── Confirm Sign Up (OTP / confirmation code) ────────────────────────────────

export async function confirmSignUp(email: string, code: string): Promise<void> {
    await amplifyConfirmSignUp({ username: email, confirmationCode: code });
}

// ─── Resend confirmation code ─────────────────────────────────────────────────

export async function resendConfirmationCode(email: string): Promise<void> {
    await amplifyResendSignUpCode({ username: email });
}

// ─── Sign In ──────────────────────────────────────────────────────────────────

export async function signIn({ email, password }: SignInParams): Promise<MedioraUser> {
    try {
        // Use USER_PASSWORD_AUTH instead of SRP (default) to avoid the
        // crypto.getRandomValues polyfill issue in Expo Go / React Native.
        const output = await amplifySignIn({
            username: email,
            password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH',
            },
        });
        if (!output.isSignedIn) {
            throw new Error(`Sign-in requires additional step: ${output.nextStep?.signInStep}`);
        }
        return getCurrentUser();
    } catch (err: any) {
        const errName = err?.name ?? err?.code ?? '';
        if (errName === 'UserAlreadyAuthenticatedException') {
            // Already signed in — just return the current session
            return getCurrentUser();
        }
        // Rethrow all other errors (NotAuthorizedException, UserNotFoundException, etc.)
        throw err;
    }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
    await amplifySignOut();
}

// ─── Get Current Authenticated User ──────────────────────────────────────────

export async function getCurrentUser(): Promise<MedioraUser> {
    const { userId } = await amplifyGetCurrentUser();
    const attrs = await fetchUserAttributes();

    return {
        userId,
        email: attrs.email ?? '',
        name: attrs.given_name,   // User Pool uses 'given_name' as the required name field
    };
}

// ─── Check if a user session exists (non-throwing) ───────────────────────────

export async function isAuthenticated(): Promise<boolean> {
    try {
        await amplifyGetCurrentUser();
        return true;
    } catch {
        return false;
    }
}
