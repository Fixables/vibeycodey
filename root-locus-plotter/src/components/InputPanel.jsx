import { useState } from 'react';

// ── Polynomial input ──────────────────────────────────────────────────────────
function PolyInput({ label, value, onChange, example, error }) {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <input
        className={`poly-input ${error ? 'poly-input--error' : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={example}
        spellCheck={false}
      />
      {error && <span className="input-error">{error}</span>}
      <span className="input-hint">e.g. {example} &nbsp;|&nbsp; (s+1)(s+2) &nbsp;|&nbsp; s^2+3s+2</span>
    </div>
  );
}

// ── Lead/Lag controller ───────────────────────────────────────────────────────
function ControllerSection({ controller, onChange }) {
  const toggle = () => onChange({ ...controller, enabled: !controller.enabled });
  return (
    <div className="controller-section">
      <div className="section-header">
        <span className="section-title">Lead/Lag Controller</span>
        <button
          className={`toggle-btn ${controller.enabled ? 'toggle-btn--on' : ''}`}
          onClick={toggle}
        >
          {controller.enabled ? 'ON' : 'OFF'}
        </button>
      </div>
      {controller.enabled && (
        <>
          <div className="controller-formula">
            C(s) = <span className="formula-num">(s + z<sub>c</sub>)</span> /{' '}
            <span className="formula-den">(s + p<sub>c</sub>)</span>
          </div>
          <div className="controller-inputs">
            <div className="input-group">
              <label className="input-label">Zero z<sub>c</sub></label>
              <input type="number" className="num-input" value={controller.zc} step="0.1"
                onChange={e => onChange({ ...controller, zc: parseFloat(e.target.value) || 0 })} />
            </div>
            <div className="input-group">
              <label className="input-label">Pole p<sub>c</sub></label>
              <input type="number" className="num-input" value={controller.pc} step="0.1"
                onChange={e => onChange({ ...controller, pc: parseFloat(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="controller-note">
            {controller.zc > controller.pc
              ? '📈 Lead compensator (increases phase)'
              : controller.zc < controller.pc
              ? '📉 Lag compensator (improves steady-state)'
              : '⚖️ Unity (z = p, no effect)'}
          </div>
        </>
      )}
    </div>
  );
}

// ── Overlay toggles ───────────────────────────────────────────────────────────
const OVERLAY_ITEMS = [
  { key: 'realAxisLocus',  label: 'Locus on Real Axis' },
  { key: 'asymptotes',     label: 'Asymptotes (|s|→∞)' },
  { key: 'breakPoints',    label: 'Break-Out / Break-In Points' },
  { key: 'angleDeparture', label: 'Angle of Departure' },
  { key: 'angleArrival',   label: 'Angle of Arrival' },
  { key: 'imagCrossings',  label: 'jω-Axis Crossings' },
  { key: 'kMarkers',       label: 'CL Poles at Selected K' },
];

function OverlaySection({ toggles, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overlay-section">
      <button className="section-collapse-btn" onClick={() => setOpen(o => !o)}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
          style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
            fill="none" strokeLinecap="round" />
        </svg>
        Educational Overlays
      </button>

      {open && (
        <div className="overlay-list">
          {OVERLAY_ITEMS.map(({ key, label }) => (
            <label key={key} className="overlay-item">
              <input
                type="checkbox"
                className="overlay-check"
                checked={!!toggles[key]}
                onChange={() => onToggle(key)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ── K slider ──────────────────────────────────────────────────────────────────
const K_MIN = 0, K_MAX = 200, K_STEPS = 1000;

function kFromSlider(t) {
  // t in [0,1] → K in [K_MIN, K_MAX], linear
  return K_MIN + t * (K_MAX - K_MIN);
}
function sliderFromK(K) {
  return (K - K_MIN) / (K_MAX - K_MIN);
}

function KSlider({ selectedK, onKChange }) {
  const t   = selectedK != null ? sliderFromK(Math.min(Math.max(selectedK, K_MIN), K_MAX)) : 0;
  const pct = (t * 100).toFixed(1);

  return (
    <div className="k-slider-section">
      <div className="k-slider-header">
        <span className="section-title">Set K</span>
        <span className="k-slider-value">K = {selectedK != null ? Number(selectedK).toFixed(4) : '—'}</span>
      </div>
      <div className="k-slider-track">
        <input
          type="range"
          className="k-slider-input"
          min={0} max={K_STEPS} step={1}
          value={Math.round(t * K_STEPS)}
          onChange={e => onKChange(kFromSlider(e.target.value / K_STEPS))}
          style={{ '--pct': `${pct}%` }}
        />
        <div className="k-slider-labels">
          <span>0</span>
          <span>{K_MAX}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
export default function InputPanel({
  numStr, denStr, controller,
  onNumChange, onDenChange, onControllerChange, onApply,
  numError, denError,
  overlayToggles, onOverlayToggle,
  selectedK, onKChange,
}) {
  return (
    <div className="panel input-panel">
      <div className="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        Transfer Function
      </div>

      <div className="tf-display">
        <div className="tf-label">G(s) = K ·</div>
        <div className="tf-fraction">
          <div className="tf-num">N(s)</div>
          <div className="tf-bar" />
          <div className="tf-den">D(s)</div>
        </div>
      </div>

      <PolyInput label="Numerator N(s)"   value={numStr} onChange={onNumChange}
        example="s + 2"             error={numError} />
      <PolyInput label="Denominator D(s)" value={denStr} onChange={onDenChange}
        example="s(s+1)(s+3)"       error={denError} />

      <div className="divider" />

      <ControllerSection controller={controller} onChange={onControllerChange} />

      <button className="apply-btn" onClick={onApply}>
        Plot Root Locus
      </button>

      <div className="divider" />

      <OverlaySection toggles={overlayToggles ?? {}} onToggle={onOverlayToggle} />

      <div className="divider" />

      <KSlider selectedK={selectedK} onKChange={onKChange} />
    </div>
  );
}
