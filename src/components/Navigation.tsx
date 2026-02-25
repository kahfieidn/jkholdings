"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navigation() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Aset", href: "/assets" },
        { name: "Pembelian", href: "/purchases" },
    ];

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    return (
        <header style={{ padding: "0 1rem", paddingTop: "1.5rem" }} ref={menuRef}>
            <nav
                className="glass-card"
                style={{
                    borderRadius: "16px",
                    padding: "0 1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "64px",
                    position: "sticky",
                    top: "1rem",
                    zIndex: 100,
                }}
            >
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                        width: "32px",
                        height: "32px",
                        background: "var(--primary)",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        <span style={{ fontSize: "1rem", color: "#000", fontWeight: 800, lineHeight: 1 }}>J</span>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                        JK <span style={{ color: "var(--primary)" }}>Holdings</span>
                    </span>
                </div>

                {/* Desktop Nav Links */}
                <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    {navLinks.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    textDecoration: "none",
                                    padding: "0.4rem 1rem",
                                    borderRadius: "10px",
                                    fontSize: "0.9rem",
                                    fontWeight: active ? 700 : 500,
                                    color: active ? "var(--primary)" : "var(--text-dim)",
                                    background: active ? "rgba(0,255,115,0.08)" : "transparent",
                                    transition: "all 0.2s",
                                }}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Right Actions */}
                <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <ThemeToggle />
                    <div style={{ width: "1px", height: "24px", background: "var(--border)" }} />
                    <button
                        onClick={() => signOut()}
                        style={{
                            background: "none",
                            border: "1px solid var(--border)",
                            color: "var(--text-dim)",
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: "0.875rem",
                            padding: "0.4rem 1rem",
                            borderRadius: "10px",
                            transition: "all 0.2s",
                        }}
                    >
                        Keluar
                    </button>
                </div>

                {/* Mobile: ThemeToggle + Hamburger */}
                <div className="nav-mobile" style={{ display: "none", alignItems: "center", gap: "0.5rem" }}>
                    <ThemeToggle />
                    <button
                        aria-label="Toggle menu"
                        onClick={() => setMenuOpen((o) => !o)}
                        style={{
                            background: "none",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                            cursor: "pointer",
                            padding: "0.4rem 0.6rem",
                            borderRadius: "10px",
                            fontSize: "1.2rem",
                            lineHeight: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </nav>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div
                    className="glass-card"
                    style={{
                        marginTop: "0.5rem",
                        borderRadius: "16px",
                        padding: "1rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        animation: "fadeIn 0.2s ease",
                        position: "sticky",
                        top: "calc(1rem + 64px + 0.5rem)",
                        zIndex: 99,
                    }}
                >
                    {navLinks.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    textDecoration: "none",
                                    padding: "0.75rem 1rem",
                                    borderRadius: "10px",
                                    fontSize: "1rem",
                                    fontWeight: active ? 700 : 500,
                                    color: active ? "var(--primary)" : "var(--text)",
                                    background: active ? "rgba(0,255,115,0.08)" : "transparent",
                                    transition: "all 0.2s",
                                    display: "block",
                                }}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                    <button
                        onClick={() => signOut()}
                        style={{
                            background: "rgba(239, 68, 68, 0.08)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            color: "var(--error)",
                            cursor: "pointer",
                            fontWeight: 500,
                            fontSize: "1rem",
                            padding: "0.75rem 1rem",
                            borderRadius: "10px",
                            width: "100%",
                            textAlign: "left",
                        }}
                    >
                        Keluar
                    </button>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .nav-desktop { display: none !important; }
                    .nav-mobile { display: flex !important; }
                }
            `}</style>
        </header>
    );
}
