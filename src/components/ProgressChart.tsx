import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { type ExamAttempt } from "../context/ExamContext";

interface Props {
    history: ExamAttempt[];
}

export default function ProgressChart({ history }: Props) {
    const data = [...history].reverse().slice(-10);

    if(data.length < 2) return null;

    return (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                Passing Progress (%)
            </Typography>
            <Box sx={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" tickFormatter={(str) => str.split(',')[0]} tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <ReferenceLine y={70} label="Passes" stroke="green" strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="score" stroke="#1976d2" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} name="Score" />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}