"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ChartData {
    name: string;
    value: number;
}

interface PortfolioChartProps {
    data: ChartData[];
}

const COLORS = [
    "#00ff73", // Primary Green
    "#6366f1", // Indigo
    "#f59e0b", // Amber
    "#ec4899", // Pink
    "#8b5cf6", // Violet
    "#06b6d4", // Cyan
    "#10b981", // Emerald
];

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="var(--text-dim)"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            fontSize="11"
            fontWeight="500"
        >
            {`${(percent * 100).toFixed(1)}%`}
        </text>
    );
};

export default function PortfolioChart({ data }: PortfolioChartProps) {
    if (data.length === 0) return null;

    // Calculate total for center display (optional but premium)
    const total = data.reduce((sum, entry) => sum + entry.value, 0);

    return (
        <div style={{ width: "100%", height: 350, marginTop: "1rem", position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={85}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1200}
                        label={renderCustomLabel}
                        labelLine={{ stroke: "var(--border)", strokeWidth: 1 }}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                stroke="transparent"
                                style={{ outline: 'none' }}
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            background: "rgba(22, 22, 26, 0.95)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "16px",
                            backdropFilter: "blur(20px)",
                            color: "#fff",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                        }}
                        itemStyle={{ color: "#fff", fontSize: "13px" }}
                        formatter={(value: number | undefined) => value !== undefined ? `Rp ${value.toLocaleString("id-ID")}` : ""}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={50}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value, entry: any) => {
                            const percent = ((entry.payload.value / total) * 100).toFixed(1);
                            return (
                                <span style={{ color: "var(--text-dim)", fontSize: "0.8rem", marginLeft: "5px" }}>
                                    {value} <span style={{ color: "var(--primary)", fontWeight: 700 }}>{percent}%</span>
                                </span>
                            );
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Center Text for Premium Look */}
            <div style={{
                position: "absolute",
                top: "43%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                pointerEvents: "none"
            }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Total Aset</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)" }}>
                    {total > 1000000 ? `${(total / 1000000).toFixed(1)}jt` : total.toLocaleString("id-ID")}
                </div>
            </div>
        </div>
    );
}
