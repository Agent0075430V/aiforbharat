// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ── Platform-specific source extensions ───────────────────────────────────
// Ensure .web.ts / .web.tsx are resolved BEFORE .ts / .tsx on web.
// This makes recorder.service.web.ts and transcriber.service.web.ts
// automatically take precedence over their native counterparts on web builds.
const { resolver: { sourceExts } } = config;
config.resolver.sourceExts = [
    // Web-specific variants (highest priority on web)
    'web.tsx', 'web.ts', 'web.jsx', 'web.js',
    // Then generic
    ...sourceExts.filter((e) => !e.startsWith('web.')),
];

// ── Web-only module aliases ────────────────────────────────────────────────
// lottie-react-native's web bundle requires @lottiefiles/dotlottie-react
// which we don't install. Instead we provide a lightweight CSS stub on web.
config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web' && moduleName === 'lottie-react-native') {
        return {
            filePath: path.resolve(__dirname, 'src/components/ui/LottieView.web.tsx'),
            type: 'sourceFile',
        };
    }
    // Default resolution for everything else
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
