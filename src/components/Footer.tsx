export default function Footer() {
    return (
        <footer style={{
            overflow: "hidden",
            position: "relative",
            paddingTop: "3rem",
            paddingBottom: "1.5rem",
            borderTop: "1px solid var(--border)",
        }}>
            {/* Big brand name */}
            <div style={{
                textAlign: "center",
                lineHeight: 1.1,
                userSelect: "none",
                pointerEvents: "none",
                position: "relative",
            }}>
                {/* Shadow / glow layer */}
                <span aria-hidden style={{
                    fontSize: "clamp(5rem, 20vw, 18rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    display: "block",
                    position: "absolute",
                    inset: 0,
                    color: "transparent",
                    filter: "blur(40px)",
                    background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    opacity: 0.25,
                    transform: "translateY(8px)",
                }}>
                    JK Holdings
                </span>

                {/* Main text */}
                <span style={{
                    fontSize: "clamp(5rem, 20vw, 18rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                    color: "transparent",
                    display: "block",
                    background: "linear-gradient(135deg, var(--text) 0%, var(--primary) 50%, var(--secondary) 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    position: "relative",
                }}>
                    JK Holdings
                </span>
            </div>
        </footer>
    );
}
