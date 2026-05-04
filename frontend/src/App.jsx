import React, { useEffect, useMemo, useState } from "react";
import { Activity, Bell, Brain, MapPin, ShieldCheck, Truck, UploadCloud } from "lucide-react";
import { assignPickup, getAdminSummary, getTrustScores, uploadFood } from "./api.js";

const initialForm = {
  donorId: "donor-1",
  foodType: "rice",
  quantityMeals: 45,
  preparedAt: new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 16),
  storageCondition: "room_temp",
  temperatureC: 28,
  donorLat: 12.9716,
  donorLng: 77.5946
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [pickup, setPickup] = useState(null);
  const [summary, setSummary] = useState(null);
  const [trust, setTrust] = useState(null);
  const [socketEvents, setSocketEvents] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    refreshAdmin();
    const ws = new WebSocket(import.meta.env.VITE_WS_URL || "ws://localhost:4000/ws/tracking");
    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      setSocketEvents((items) => [parsed, ...items].slice(0, 5));
      if (parsed.type === "pickup_update") setPickup(parsed.pickup);
    };
    return () => ws.close();
  }, []);

  async function refreshAdmin() {
    const [adminData, trustData] = await Promise.all([getAdminSummary(), getTrustScores()]);
    setSummary(adminData);
    setTrust(trustData);
  }

  async function handleAnalyze(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (image) payload.append("image", image);
      const result = await uploadFood(payload);
      setAnalysis(result);
      await refreshAdmin();
    } finally {
      setBusy(false);
    }
  }

  async function handleAssign(ngo) {
    const result = await assignPickup({
      foodListingId: analysis.listing.id,
      ngoId: ngo.id,
      donorLocation: analysis.listing.donorLocation
    });
    setPickup(result.pickup);
    await refreshAdmin();
  }

  const statusClass = useMemo(() => {
    const status = analysis?.safety?.status;
    if (status === "Safe") return "safe";
    if (status === "Risky") return "risky";
    return "unsafe";
  }, [analysis]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Brain size={28} />
          <div>
            <strong>AI Mess Food Redistribution</strong>
            <span>Decision cockpit</span>
          </div>
        </div>
        <nav>
          <a href="#upload"><UploadCloud size={18} /> Upload Food</a>
          <a href="#recommendations"><ShieldCheck size={18} /> NGO Recommendations</a>
          <a href="#tracking"><Truck size={18} /> Live Tracking</a>
          <a href="#admin"><Activity size={18} /> Admin</a>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>Food Donation Intelligence Console</h1>
            <p>Safety decisions, expiry prediction, NGO matching, and pickup visibility in one workflow.</p>
          </div>
          <div className="metric-row">
            <Metric label="Listings" value={summary?.listings ?? 0} />
            <Metric label="Pickups" value={summary?.pickups ?? 0} />
            <Metric label="Alerts" value={summary?.notifications ?? 0} />
          </div>
        </header>

        <section id="upload" className="panel two-column">
          <form onSubmit={handleAnalyze} className="form-panel">
            <h2>Upload Food</h2>
            <label>Food image<input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0])} /></label>
            <label>Food type<input value={form.foodType} onChange={(e) => setForm({ ...form, foodType: e.target.value })} /></label>
            <label>Quantity meals<input type="number" value={form.quantityMeals} onChange={(e) => setForm({ ...form, quantityMeals: e.target.value })} /></label>
            <label>Prepared at<input type="datetime-local" value={form.preparedAt} onChange={(e) => setForm({ ...form, preparedAt: e.target.value })} /></label>
            <label>Storage<select value={form.storageCondition} onChange={(e) => setForm({ ...form, storageCondition: e.target.value })}>
              <option value="refrigerated">Refrigerated</option>
              <option value="insulated">Insulated</option>
              <option value="room_temp">Room temperature</option>
              <option value="open_air">Open air</option>
              <option value="hot_case">Hot case</option>
            </select></label>
            <label>Temperature C<input type="number" value={form.temperatureC} onChange={(e) => setForm({ ...form, temperatureC: e.target.value })} /></label>
            <button disabled={busy} className="primary"><UploadCloud size={18} /> {busy ? "Analyzing..." : "Analyze Food"}</button>
          </form>

          <div className="result-panel">
            <h2>Decision Engine</h2>
            {analysis ? (
              <>
                <div className={`status-pill ${statusClass}`}>{analysis.safety.status}</div>
                <p className="big-number">{analysis.expiry.remainingSafeHours}h remaining</p>
                <ul>{analysis.safety.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
                <div className="mini-grid">
                  <Metric label="Food" value={analysis.listing.foodType.replaceAll("_", " ")} />
                  <Metric label="Risk points" value={analysis.safety.riskPoints} />
                  <Metric label="Vision confidence" value={analysis.listing.vision.confidence} />
                </div>
              </>
            ) : (
              <p className="empty">Submit a food listing to see safety and expiry reasoning.</p>
            )}
          </div>
        </section>

        <section id="recommendations" className="panel">
          <h2>NGO Recommendations</h2>
          <div className="cards">
            {(analysis?.topNgos || []).map((ngo) => (
              <article key={ngo.id} className="ngo-card">
                <div>
                  <h3>{ngo.name}</h3>
                  <p>{ngo.distanceKm} km away · {ngo.availableMeals} meals available</p>
                </div>
                <strong>{Math.round(ngo.score * 100)}%</strong>
                <ul>{ngo.explanation.map((item) => <li key={item}>{item}</li>)}</ul>
                <button onClick={() => handleAssign(ngo)}><Truck size={16} /> Assign Pickup</button>
              </article>
            ))}
          </div>
        </section>

        <section id="tracking" className="panel two-column">
          <div>
            <h2>Live Tracking Map</h2>
            <div className="map-sim">
              <MapPin className="pin donor" />
              <Truck className="pin truck" />
              <MapPin className="pin ngo" />
            </div>
          </div>
          <div>
            <h2>Pickup Status</h2>
            {pickup ? <pre>{JSON.stringify(pickup, null, 2)}</pre> : <p className="empty">Assign an NGO to start tracking.</p>}
            <h3>Socket Events</h3>
            {socketEvents.map((event, index) => <p className="event" key={`${event.type}-${index}`}>{event.type}</p>)}
          </div>
        </section>

        <section id="admin" className="panel two-column">
          <div>
            <h2><Bell size={20} /> Admin Dashboard</h2>
            <pre>{JSON.stringify(summary, null, 2)}</pre>
          </div>
          <div>
            <h2>Trust Scores</h2>
            <div className="trust-list">
              {[...(trust?.donors || []), ...(trust?.ngos || [])].map((item) => (
                <div key={item.id}><span>{item.name}</span><meter min="0" max="100" value={item.trustScore} /> <b>{item.trustScore}</b></div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>;
}
