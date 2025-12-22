import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Free AI Prompt Maker - Visual Prompt Generator';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                {/* Decorative gradient circles */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-100px',
                        right: '-100px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-150px',
                        left: '-150px',
                        width: '500px',
                        height: '500px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)',
                    }}
                />

                {/* Main content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        textAlign: 'center',
                    }}
                >
                    {/* Logo/Icon */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                            marginBottom: '30px',
                            fontSize: '40px',
                        }}
                    >
                        ✨
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            fontSize: '64px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: '0 0 16px 0',
                            letterSpacing: '-2px',
                        }}
                    >
                        Free AI Prompt Maker
                    </h1>

                    {/* Subtitle */}
                    <p
                        style={{
                            fontSize: '28px',
                            color: '#94a3b8',
                            margin: '0',
                            maxWidth: '800px',
                        }}
                    >
                        Visual Prompt Generator for Midjourney, DALL-E & Stable Diffusion
                    </p>

                    {/* Features */}
                    <div
                        style={{
                            display: 'flex',
                            gap: '24px',
                            marginTop: '40px',
                        }}
                    >
                        {['Free Forever', 'No Sign-up', 'Click to Create'].map((feature) => (
                            <div
                                key={feature}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 20px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '100px',
                                    color: '#e2e8f0',
                                    fontSize: '18px',
                                }}
                            >
                                <span style={{ color: '#22d3ee' }}>✓</span>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                {/* URL at bottom */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '30px',
                        color: '#64748b',
                        fontSize: '20px',
                    }}
                >
                    freeaipromptmaker.com
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
