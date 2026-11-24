import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import './TelemetryChart.css';

function TelemetryChart({ data, dataKey, color = '#3478e5', title }) {
    return (
        <section className="telemetry-chart">
            <div className="telemetry-chart-heading">
                <h3>{title}</h3>
                <span>Last 7 readings</span>
            </div>

            <div className="telemetry-chart-area">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid stroke="#e7edf6" strokeDasharray="3 3" />
                        <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

export default TelemetryChart;