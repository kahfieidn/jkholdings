"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navigation from "@/components/Navigation";
import { MOCK_ASSETS } from "@/lib/mock-data";
import { Asset, Purchase, PortfolioState } from "@/types";
import { getPortfolio, addPurchase } from "@/lib/portfolio-store";

export default function PurchasesPage() {
    const { data: session } = useSession();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [buyModalOpen, setBuyModalOpen] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        // Load assets from MOCK + localStorage
        const stored = localStorage.getItem("jk_assets");
        let all = [...MOCK_ASSETS];
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                parsed.forEach((a: Asset) => {
                    if (!all.find(x => x.id === a.id)) all.push(a);
                });
            } catch (e) { }
        }
        setAssets(all);
        setPortfolio(getPortfolio());
    }, []);

    const openAddTransaction = () => {
        setSelectedAsset(assets[0] || null);
        setQuantity(1);
        setBuyModalOpen(true);
        setMessage(null);
    };

    const handleBuy = () => {
        if (!selectedAsset || !portfolio) return;

        const totalCost = selectedAsset.price * quantity;
        if (totalCost > portfolio.balance) {
            setMessage({ type: "error", text: "Saldo tidak mencukupi untuk transaksi ini." });
            return;
        }

        const newPurchase: Purchase = {
            id: Date.now().toString(),
            userId: session?.user?.email || "guest",
            assetId: selectedAsset.id,
            amount: totalCost,
            quantity: quantity,
            purchaseDate: new Date().toISOString(),
            status: "Completed",
        };

        const updated = addPurchase(newPurchase);
        setPortfolio(updated);
        setBuyModalOpen(false);
        setMessage({ type: "success", text: `Berhasil membeli ${quantity} unit ${selectedAsset.name}!` });

        // Clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
    };

    if (!portfolio) return null;

    return (
        <div className="fade-in">
            <Navigation />

            <main className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
                <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                    <div>
                        <h1>Riwayat Pembelian</h1>
                        <p>Kelola dan pantau seluruh transaksi aset Anda.</p>
                        <div className="glass-card" style={{ display: "inline-block", marginTop: "1rem", padding: "0.75rem 1.5rem" }}>
                            Saldo Tersedia: <span style={{ color: "var(--primary)", fontWeight: 800 }}>Rp {portfolio.balance.toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={openAddTransaction} style={{ padding: "0.8rem 2rem", fontSize: "1rem" }}>
                        + Tambah Transaksi
                    </button>
                </header>

                {message && (
                    <div style={{
                        padding: "1rem",
                        borderRadius: "12px",
                        marginBottom: "2rem",
                        background: message.type === "success" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        color: message.type === "success" ? "var(--success)" : "var(--error)",
                        border: `1px solid ${message.type === "success" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
                        animation: "fadeIn 0.3s ease"
                    }}>
                        {message.text}
                    </div>
                )}



                <section>
                    <h2 style={{ marginBottom: "1.5rem" }}>Riwayat Transaksi</h2>
                    {portfolio.purchases.length > 0 ? (
                        <div className="glass-card" style={{ padding: "0", overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                                <thead style={{ borderBottom: "1px solid var(--border)" }}>
                                    <tr>
                                        <th style={{ textAlign: "left", padding: "1rem 1.5rem" }}>Aset</th>
                                        <th style={{ textAlign: "right", padding: "1rem 1.5rem" }}>Unit</th>
                                        <th style={{ textAlign: "right", padding: "1rem 1.5rem" }}>Total</th>
                                        <th style={{ textAlign: "right", padding: "1rem 1.5rem" }}>Tanggal</th>
                                        <th style={{ textAlign: "center", padding: "1rem 1.5rem" }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolio.purchases.map((p) => {
                                        const asset = assets.find(a => a.id === p.assetId);
                                        return (
                                            <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                                <td style={{ padding: "1rem 1.5rem", fontWeight: 600 }}>{asset?.name || "Unknown"}</td>
                                                <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>{p.quantity}</td>
                                                <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Rp {p.amount.toLocaleString("id-ID")}</td>
                                                <td style={{ padding: "1rem 1.5rem", textAlign: "right", color: "var(--text-dim)", fontSize: "0.85rem" }}>
                                                    {new Date(p.purchaseDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                                </td>
                                                <td style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
                                                    <span style={{
                                                        fontSize: "0.75rem",
                                                        padding: "0.2rem 0.6rem",
                                                        borderRadius: "20px",
                                                        background: "rgba(16, 185, 129, 0.1)",
                                                        color: "var(--success)"
                                                    }}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
                            <p style={{ color: "var(--text-dim)" }}>Belum ada riwayat transaksi.</p>
                        </div>
                    )}
                </section>
            </main>

            {/* Buy Modal */}
            {buyModalOpen && selectedAsset && (
                <div
                    onClick={() => setBuyModalOpen(false)}
                    style={{
                        position: "fixed", inset: 0, zIndex: 999,
                        background: "rgba(0,0,0,0.6)",
                        backdropFilter: "blur(8px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "1rem", animation: "fadeIn 0.2s ease"
                    }}
                >
                    <div
                        className="glass-card"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: "450px" }}
                    >
                        <h2 style={{ marginBottom: "1.5rem" }}>Tambah Transaksi</h2>

                        <div className="form-group">
                            <label className="form-label">Pilih Aset</label>
                            <select
                                className="form-input"
                                value={selectedAsset.id}
                                onChange={(e) => {
                                    const asset = assets.find(a => a.id === e.target.value);
                                    if (asset) setSelectedAsset(asset);
                                }}
                                style={{
                                    background: "rgba(255, 255, 255, 0.05)",
                                    color: "inherit",
                                    border: "1px solid var(--border)"
                                }}
                            >
                                {assets.map(asset => (
                                    <option key={asset.id} value={asset.id} style={{ background: "#1a1a1a" }}>
                                        {asset.name} - Rp {asset.price.toLocaleString("id-ID")}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "rgba(var(--primary-rgb), 0.05)", borderRadius: "12px", border: "1px dashed var(--primary)" }}>
                            <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600, marginBottom: "0.25rem" }}>{selectedAsset.type}</div>
                            <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{selectedAsset.name}</div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Jumlah Unit</label>
                            <input
                                type="number"
                                min="1"
                                className="form-input"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                        </div>

                        <div style={{ margin: "1.5rem 0", padding: "1rem", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontWeight: 600 }}>Total Harga:</span>
                            <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>Rp {(selectedAsset.price * quantity).toLocaleString("id-ID")}</span>
                        </div>

                        {message && message.type === "error" && (
                            <div style={{ color: "var(--error)", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>
                                {message.text}
                            </div>
                        )}

                        <div style={{ display: "flex", gap: "1rem" }}>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleBuy}>
                                Konfirmasi Beli
                            </button>
                            <button className="btn" style={{ flex: 1, background: "var(--glass)", border: "1px solid var(--border)" }} onClick={() => setBuyModalOpen(false)}>
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
