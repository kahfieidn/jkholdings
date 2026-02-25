import { auth, signOut } from "@/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen flex-center flex-column fade-in" style={{ flexDirection: "column", textAlign: "center", padding: "2rem" }}>
      <header style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>Invest in Your Future</h1>
        <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto" }}>
          Premium asset management platform. Start building your portfolio with JK Holdings today.
        </p>
      </header>

      <div style={{ display: "flex", gap: "1.5rem" }}>
        {session ? (
          <Link href="/dashboard" className="btn btn-primary" style={{ minWidth: "200px" }}>
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="btn btn-primary" style={{ minWidth: "200px" }}>
              Get Started
            </Link>
            <Link href="/assets" className="btn" style={{ minWidth: "200px", border: "1px solid var(--border)" }}>
              View Market
            </Link>
          </>
        )}
      </div>

      <div style={{ marginTop: "4rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", maxWidth: "900px" }}>
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>Secure</h3>
          <p style={{ fontSize: "0.875rem" }}>Enterprise-grade security for your assets.</p>
        </div>
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>Diverse</h3>
          <p style={{ fontSize: "0.875rem" }}>Real estate, stocks, crypto, and precious metals.</p>
        </div>
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <h3 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>Smart</h3>
          <p style={{ fontSize: "0.875rem" }}>AI-driven insights for better investment decisions.</p>
        </div>
      </div>
    </div>
  );
}
