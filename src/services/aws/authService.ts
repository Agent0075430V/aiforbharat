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
                name,
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
    await amplifySignIn({ username: email, password });
    return getCurrentUser();
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
        name: attrs.name,
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
