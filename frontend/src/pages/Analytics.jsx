import { useEffect, useState } from 'react';
import TelemetryChart from '../components/analytics/TelemetryChart';
import { getTelemetry } from '../services/api';

import './Analytics.css';

const deviceId = 'TURBINE-001';

function Analytics() {
    const [telemetryData, setTelemetryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        const loadTelemetry = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await getTelemetry({
                    deviceId,
                    limit: 50,
                    signal: controller.signal,
                });

                setTelemetryData(response.data.data
                    .map((reading) => ({
                        ...reading,
                        time: new Date(reading.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                    }))
                    .reverse());
            } catch (requestError) {
                if (!controller.signal.aborted) {
                    setError(
                        requestError.response?.data?.message
                        || 'Unable to load telemetry. Check that the backend is running.'
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadTelemetry();

        return () => controller.abort();
    }, []);

    return (
        <main className="analytics-page">
            <header className="analytics-header">
                <div>
                    <h1>Telemetry Analytics</h1>
                    <p>Review recent sensor readings from your connected devices.</p>
                </div>
                <span className="analytics-device">TURBINE-001</span>
            </header>

            {loading && <p className="analytics-message" role="status">Loading telemetry…</p>}
            {!loading && error && (
                <p className="analytics-message error" role="alert">{error}</p>
            )}
            {!loading && !error && telemetryData.length === 0 && (
                <p className="analytics-message" role="status">
                    No telemetry readings found for {deviceId}.
                </p>
            )}
            {!loading && !error && telemetryData.length > 0 && (
                <div className="telemetry-chart-grid">
                    <TelemetryChart
                        data={telemetryData}
                        dataKey="temperature"
                        color="#e58b32"
                        title="Temperature"
                    />
                    <TelemetryChart
                        data={telemetryData}
                        dataKey="vibration"
                        color="#8054d8"
                        title="Vibration"
                    />
                    <TelemetryChart
                        data={telemetryData}
                        dataKey="pressure"
                        color="#169b69"
                        title="Pressure"
                    />
                </div>
            )}
        </main>
    );
}

export default Analytics;