import { auth } from "@/auth";
import Navigation from "@/components/Navigation";
import { MOCK_ASSETS } from "@/lib/mock-data";

export default async function DashboardPage() {
    const session = await auth();

    // Mock owned assets (subset of MOCK_ASSETS for demo)
    const ownedAssets = [MOCK_ASSETS[0], MOCK_ASSETS[2]];
    const totalValue = ownedAssets.reduce((acc, curr) => acc + curr.price, 0);

    return (
        <div className="fade-in">
            <Navigation />

            <main className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
                <header style={{ marginBottom: "2rem" }}>
                    <h1>Welcome back, {session?.user?.name}</h1>
                    <p>Here's an overview of your investment portfolio.</p>
                </header>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "2.5rem"
                }}>
                    <div className="glass-card">
                        <p style={{ marginBottom: "0.5rem" }}>Total Portfolio Value</p>
                        <div style={{ fontSize: "clamp(1.6rem, 5vw, 2.5rem)", fontWeight: 800, color: "var(--primary)" }}>
                            Rp {totalValue.toLocaleString("id-ID")}
                        </div>
                        <p style={{ marginTop: "1rem", color: "var(--success)" }}>
                            +4.2% from last month
                        </p>
                    </div>

                    <div className="glass-card">
                        <p style={{ marginBottom: "0.5rem" }}>Available Balance</p>
                        <div style={{ fontSize: "clamp(1.6rem, 5vw, 2.5rem)", fontWeight: 800 }}>
                            Rp 1.250.000.000
                        </div>
                        <button className="btn btn-primary" style={{ marginTop: "1rem", fontSize: "0.875rem" }}>
                            Top Up Balance
                        </button>
                    </div>
                </div>

                <section>
                    <h2 style={{ marginBottom: "1.5rem" }}>Your Assets</h2>

                    {/* Table — hidden on mobile, replaced by cards */}
                    <div className="glass-card dashboard-table-wrap" style={{ padding: "0", overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                            <thead style={{ borderBottom: "1px solid var(--border)" }}>
                                <tr>
                                    <th style={{ textAlign: "left", padding: "1.25rem 1.5rem" }}>Asset</th>
                                    <th style={{ textAlign: "left", padding: "1.25rem 1.5rem" }}>Type</th>
                                    <th style={{ textAlign: "right", padding: "1.25rem 1.5rem" }}>Value</th>
                                    <th style={{ textAlign: "right", padding: "1.25rem 1.5rem" }}>Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ownedAssets.map((asset) => (
                                    <tr key={asset.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                        <td style={{ padding: "1.25rem 1.5rem", fontWeight: 600 }}>{asset.name}</td>
                                        <td style={{ padding: "1.25rem 1.5rem", color: "var(--text-dim)" }}>{asset.type}</td>
                                        <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>Rp {asset.price.toLocaleString("id-ID")}</td>
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
                        {ownedAssets.map((asset) => (
                            <div key={asset.id} className="glass-card" style={{ padding: "1.25rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                                    <div>
                                        <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.25rem" }}>
                                            {asset.type}
                                        </div>
                                        <div style={{ fontWeight: 700 }}>{asset.name}</div>
                                    </div>
                                    <div style={{ color: asset.change >= 0 ? "var(--success)" : "var(--error)", fontWeight: 700, fontSize: "0.95rem" }}>
                                        {asset.change >= 0 ? "+" : ""}{asset.change}%
                                    </div>
                                </div>
                                <div style={{ fontWeight: 800, fontSize: "1.15rem" }}>
                                    Rp {asset.price.toLocaleString("id-ID")}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <style>{`
                @media (max-width: 580px) {
                    .dashboard-table-wrap { display: none !important; }
                    .dashboard-mobile-cards { display: flex !important; }
                }
            `}</style>
        </div>
    );
}
