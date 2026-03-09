/**
 * LottieView.web.tsx
 *
 * Web stub for lottie-react-native.
 * On web builds, LottieView renders a simple pulsing placeholder
 * instead of requiring @lottiefiles/dotlottie-react (which is not installed).
 */

import React, { useEffect, useRef } from 'react';

interface LottieViewProps {
    source?: any;
    autoPlay?: boolean;
    loop?: boolean;
    style?: React.CSSProperties & { width?: number | string; height?: number | string };
    speed?: number;
    [key: string]: any;
}

const LottieView = React.forwardRef<HTMLDivElement, LottieViewProps>(
    ({ style, ...rest }, ref) => {
        const width = style?.width ?? 100;
        const height = style?.height ?? 100;

        return (
            <div
                ref={ref}
                style={{
                    width,
                    height,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...style,
                }}
            >
                <div
                    style={{
                        width: '60%',
                        height: '60%',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(200,169,110,0.6) 0%, rgba(200,169,110,0.05) 70%)',
                        animation: 'lottie-pulse 1.8s ease-in-out infinite',
                    }}
                />
                <style>{`
          @keyframes lottie-pulse {
            0%, 100% { transform: scale(0.85); opacity: 0.6; }
            50%       { transform: scale(1.1);  opacity: 1;   }
          }
        `}</style>
            </div>
        );
    }
);

LottieView.displayName = 'LottieView';
export default LottieView;
