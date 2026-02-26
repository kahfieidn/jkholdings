"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { getPortfolio } from "@/lib/portfolio-store";
import { PortfolioState, Asset } from "@/types";
import PortfolioChart from "@/components/PortfolioChart";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
    const [allAssets, setAllAssets] = useState<Asset[]>(MOCK_ASSETS);

    useEffect(() => {
        // Load combined assets (localStorage + MOCK)
        const storedAssets = localStorage.getItem("jk_assets");
        if (storedAssets) {
            try {
                const parsed = JSON.parse(storedAssets);
                // Merge MOCK and Stored based on ID, avoiding duplicates
                const merged = [...MOCK_ASSETS];
                parsed.forEach((a: Asset) => {
                    if (!merged.find(m => m.id === a.id)) merged.push(a);
                });
                setAllAssets(merged);
            } catch (e) {
                console.error("Error loading assets", e);
            }
        }

        const loadPortfolio = () => {
            setPortfolio(getPortfolio());
        };

        loadPortfolio();
        window.addEventListener("focus", loadPortfolio);
        return () => window.removeEventListener("focus", loadPortfolio);
    }, []);

    if (!portfolio) return null;

    // Calculate aggregated assets for display
    const assetSummary = portfolio.purchases.reduce((acc, curr) => {
        const existing = acc.find(a => a.assetId === curr.assetId);
        if (existing) {
            existing.quantity += curr.quantity;
            existing.totalValue += curr.amount;
        } else {
            const assetData = allAssets.find(a => a.id === curr.assetId);
            acc.push({
                assetId: curr.assetId,
                name: assetData?.name || "Unknown Asset",
                type: assetData?.type || "Other",
                quantity: curr.quantity,
                totalValue: curr.amount,
                change: assetData?.change || 0,
                price: assetData?.price || 0
            });
        }
        return acc;
    }, [] as any[]);

    const totalPortfolioValue = assetSummary.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const chartData = assetSummary.map(asset => ({
        name: asset.name,
        value: asset.price * asset.quantity
    }));

    return (
        <div className="fade-in">
            <Navigation />

            <main className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
                <header style={{ marginBottom: "2rem" }}>
                    <h1>Welcome back, {session?.user?.name || "Member"}</h1>
                    <p>Here's an overview of your investment portfolio.</p>
                </header>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "2.5rem"
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div className="glass-card">
                            <p style={{ marginBottom: "0.5rem" }}>Total Portfolio Value</p>
                            <div style={{ fontSize: "clamp(1.6rem, 5vw, 2.5rem)", fontWeight: 800, color: "var(--primary)" }}>
                                Rp {totalPortfolioValue.toLocaleString("id-ID")}
                            </div>
                            <p style={{ marginTop: "1rem", color: "var(--success)" }}>
                                +4.2% from last month
                            </p>
                        </div>

                        <div className="glass-card">
                            <p style={{ marginBottom: "0.5rem" }}>Available Balance</p>
                            <div style={{ fontSize: "clamp(1.6rem, 5vw, 2.5rem)", fontWeight: 800 }}>
                                Rp {portfolio.balance.toLocaleString("id-ID")}
                            </div>
                            <button className="btn btn-primary" style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
                                Top Up Balance
                            </button>
                        </div>
                    </div>

                    <div className="glass-card" style={{ display: "flex", flexDirection: "column" }}>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>Portfolio Composition</h3>
                        <p style={{ fontSize: "0.85rem", marginBottom: "1rem" }}>Distribution of assets by current value</p>
                        {chartData.length > 0 ? (
                            <PortfolioChart data={chartData} />
                        ) : (
                            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px", color: "var(--text-dim)" }}>
                                No data to display
                            </div>
                        )}
                    </div>
                </div>

                <section>
                    <h2 style={{ marginBottom: "1.5rem" }}>Your Assets</h2>

                    {assetSummary.length > 0 ? (
                        <>
                            {/* Table — hidden on mobile, replaced by cards */}
                            <div className="glass-card dashboard-table-wrap" style={{ padding: "0", overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                                    <thead style={{ borderBottom: "1px solid var(--border)" }}>
                                        <tr>
                                            <th style={{ textAlign: "left", padding: "1.25rem 1.5rem" }}>Asset</th>
                                            <th style={{ textAlign: "left", padding: "1.25rem 1.5rem" }}>Type</th>
                                            <th style={{ textAlign: "right", padding: "1.25rem 1.5rem" }}>Units</th>
                                            <th style={{ textAlign: "right", padding: "1.25rem 1.5rem" }}>Current Value</th>
                                            <th style={{ textAlign: "right", padding: "1.25rem 1.5rem" }}>Performance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {assetSummary.map((asset) => (
                                            <tr key={asset.assetId} style={{ borderBottom: "1px solid var(--border)" }}>
                                                <td style={{ padding: "1.25rem 1.5rem", fontWeight: 600 }}>{asset.name}</td>
                                                <td style={{ padding: "1.25rem 1.5rem", color: "var(--text-dim)" }}>{asset.type}</td>
                                                <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>{asset.quantity}</td>
                                                <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>Rp {(asset.price * asset.quantity).toLocaleString("id-ID")}</td>
                                                <td style={{
                                                    padding: "1.25rem 1.5rem",
                                                    textAlign: "right",
                                                    color: asset.change >= 0 ? "var(--success)" : "var(--error)"
                                                }}>
                                                    {asset.change >= 0 ? "+" : ""}{asset.change}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile asset cards */}
                            <div className="dashboard-mobile-cards" style={{ display: "none", flexDirection: "column", gap: "1rem" }}>
                                {assetSummary.map((asset) => (
                                    <div key={asset.assetId} className="glass-card" style={{ padding: "1.25rem" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                                            <div>
                                                <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>
                                                    {asset.type} • {asset.quantity} Units
                                                </div>
                                                <div style={{ fontWeight: 700 }}>{asset.name}</div>
                                            </div>
                                            <div style={{ color: asset.change >= 0 ? "var(--success)" : "var(--error)", fontWeight: 700, fontSize: "0.95rem" }}>
                                                {asset.change >= 0 ? "+" : ""}{asset.change}%
                                            </div>
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: "1.15rem" }}>
                                            Rp {(asset.price * asset.quantity).toLocaleString("id-ID")}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="glass-card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                            <p style={{ color: "var(--text-dim)", marginBottom: "1.5rem" }}>You don't own any assets yet.</p>
                            <a href="/purchases" className="btn btn-primary" style={{ textDecoration: "none" }}>Purchase Your First Asset</a>
                        </div>
                    )}
                </section>
            </main>

            <style>{`
                @media (max-width: 640px) {
                    .dashboard-table-wrap { display: none !important; }
                    .dashboard-mobile-cards { display: flex !important; }
                }
            `}</style>
        </div>
    );
}
