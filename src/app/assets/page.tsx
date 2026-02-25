"use client";

import { useState, useEffect } from "react";
import { Asset, AssetType } from "@/types";
import Navigation from "@/components/Navigation";

const ASSET_TYPES: AssetType[] = ["Obligasi", "Pasar Uang", "Crypto", "Stock"];

const INITIAL_ASSETS: Asset[] = [
    {
        id: "1",
        name: "Obligasi Pemerintah FR0091",
        type: "Obligasi",
        price: 100000000,
        change: 0.8,
        description: "Obligasi Negara Ritel seri FR0091 dengan kupon tetap.",
        image: "https://images.unsplash.com/photo-1611974714851-eb604618e3d3?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "2",
        name: "Reksa Dana Pasar Uang",
        type: "Pasar Uang",
        price: 50000000,
        change: 0.3,
        description: "Reksa dana pasar uang dengan likuiditas tinggi dan risiko rendah.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "3",
        name: "Bitcoin (BTC)",
        type: "Crypto",
        price: 950000000,
        change: 5.8,
        description: "Aset kripto terbesar berdasarkan kapitalisasi pasar.",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "4",
        name: "Saham BBRI",
        type: "Stock",
        price: 4500,
        change: -1.2,
        description: "Saham PT Bank Rakyat Indonesia (Persero) Tbk.",
        image: "https://images.unsplash.com/photo-1611974714851-eb604618e3d3?auto=format&fit=crop&w=400&q=80",
    },
];

const EMPTY_FORM: Omit<Asset, "id"> = {
    name: "",
    type: "Obligasi",
    price: 0,
    change: 0,
    description: "",
    image: "",
};

export default function AssetsPage() {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [form, setForm] = useState<Omit<Asset, "id">>(EMPTY_FORM);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("jk_assets");
        if (stored) {
            setAssets(JSON.parse(stored));
        } else {
            setAssets(INITIAL_ASSETS);
        }
    }, []);

    const saveAssets = (updated: Asset[]) => {
        setAssets(updated);
        localStorage.setItem("jk_assets", JSON.stringify(updated));
    };

    const openAdd = () => {
        setEditingAsset(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (asset: Asset) => {
        setEditingAsset(asset);
        setForm({ name: asset.name, type: asset.type, price: asset.price, change: asset.change, description: asset.description, image: asset.image });
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
        setTimeout(() => {
            saveAssets(assets.filter((a) => a.id !== id));
            setDeletingId(null);
        }, 400);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAsset) {
            saveAssets(assets.map((a) => (a.id === editingAsset.id ? { ...form, id: editingAsset.id } : a)));
        } else {
            const newAsset: Asset = { ...form, id: Date.now().toString() };
            saveAssets([...assets, newAsset]);
        }
        setShowModal(false);
    };

    return (
        <div className="fade-in">
            <Navigation />

            <main className="container" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
                <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                        <h1>Manajemen Aset</h1>
                        <p>Kelola semua aset investasi Anda.</p>
                    </div>
                    <button className="btn btn-primary" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "1.25rem", lineHeight: 1 }}>+</span> Tambah Aset
                    </button>
                </header>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="glass-card"
                            style={{
                                padding: "0",
                                overflow: "hidden",
                                opacity: deletingId === asset.id ? 0.3 : 1,
                                transform: deletingId === asset.id ? "scale(0.95)" : "scale(1)",
                                transition: "opacity 0.4s ease, transform 0.4s ease",
                            }}
                        >
                            {asset.image && (
                                <div style={{ height: "180px", backgroundImage: `url(${asset.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                            )}
                            <div style={{ padding: "1.5rem" }}>
                                <div style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", marginBottom: "0.5rem" }}>
                                    {asset.type}
                                </div>
                                <h3 style={{ marginBottom: "0.25rem", fontSize: "1.1rem" }}>{asset.name}</h3>
                                <p style={{ fontSize: "0.85rem", marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {asset.description}
                                </p>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                                    <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                                        Rp {asset.price.toLocaleString("id-ID")}
                                    </div>
                                    <div style={{ color: asset.change >= 0 ? "var(--success)" : "var(--error)", fontWeight: 600, fontSize: "0.9rem" }}>
                                        {asset.change >= 0 ? "+" : ""}{asset.change}%
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "0.75rem" }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => openEdit(asset)}
                                        style={{ flex: 1, fontSize: "0.875rem", padding: "0.6rem" }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={() => handleDelete(asset.id)}
                                        style={{ flex: 1, fontSize: "0.875rem", padding: "0.6rem", background: "rgba(239, 68, 68, 0.1)", color: "var(--error)", border: "1px solid rgba(239, 68, 68, 0.25)" }}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {assets.length === 0 && (
                        <div className="glass-card" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 2rem" }}>
                            <p style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Belum ada aset. Tambahkan aset pertama Anda!</p>
                            <button className="btn btn-primary" onClick={openAdd}>+ Tambah Aset</button>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && (
                <div
                    onClick={() => setShowModal(false)}
                    style={{
                        position: "fixed", inset: 0, zIndex: 999,
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(6px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "1rem",
                        animation: "fadeIn 0.2s ease"
                    }}
                >
                    <div
                        className="glass-card"
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}
                    >
                        <h2 style={{ marginBottom: "1.5rem" }}>
                            {editingAsset ? "Edit Aset" : "Tambah Aset Baru"}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Nama Aset</label>
                                <input required className="form-input" placeholder="Contoh: Apartemen Jakarta Selatan" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tipe Aset</label>
                                <select required className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AssetType })}>
                                    {ASSET_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
                                <div className="form-group">
                                    <label className="form-label">Harga (Rp)</label>
                                    <input required type="number" className="form-input" placeholder="0" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Perubahan (%)</label>
                                    <input required type="number" step="0.01" className="form-input" placeholder="0.00" value={form.change || ""} onChange={(e) => setForm({ ...form, change: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Deskripsi</label>
                                <textarea className="form-input" placeholder="Deskripsi singkat aset..." rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
                            </div>

                            <div className="form-group">
                                <label className="form-label">URL Gambar (opsional)</label>
                                <input type="url" className="form-input" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                            </div>

                            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {editingAsset ? "Simpan Perubahan" : "Tambah Aset"}
                                </button>
                                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ flex: 1, background: "var(--glass)", border: "1px solid var(--border)", color: "var(--text)" }}>
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
