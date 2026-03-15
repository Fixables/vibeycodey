// ─── helpers ──────────────────────────────────────────────────────────────────
function fmt(val, unit = '', decimals = 4) {
  if (val === null || val === undefined || !isFinite(val)) return '—';
  return `${val.toFixed(decimals)}${unit ? ' ' + unit : ''}`;
}
function complexStr(r) {
  if (!r) return '—';
  if (Math.abs(r.im) < 1e-5) return r.re.toFixed(4);
  const sign = r.im >= 0 ? '+' : '-';
  return `${r.re.toFixed(4)} ${sign} ${Math.abs(r.im).toFixed(4)}j`;
}
function fmtDeg(d) { return d != null ? d.toFixed(1) + '°' : '—'; }

function StabilityBadge({ isStable }) {
  if (isStable === null || isStable === undefined) return null;
  return (
    <span className={`badge ${isStable ? 'badge--stable' : 'badge--unstable'}`}>
      {isStable ? '✓ Stable' : '✗ Unstable'}
    </span>
  );
}

function PolesZerosTable({ poles, zeros }) {
  return (
    <div className="pz-section">
      <div className="pz-col">
        <div className="pz-header pz-poles-header">
          <span className="pz-marker">×</span> Open-Loop Poles
        </div>
        {poles?.length ? poles.map((p, i) => (
          <div key={i} className="pz-row">{complexStr(p)}</div>
        )) : <div className="pz-empty">None</div>}
      </div>
      <div className="pz-col">
        <div className="pz-header pz-zeros-header">
          <span className="pz-marker pz-zero-marker">○</span> Open-Loop Zeros
        </div>
        {zeros?.length ? zeros.map((z, i) => (
          <div key={i} className="pz-row">{complexStr(z)}</div>
        )) : <div className="pz-empty">None</div>}
      </div>
    </div>
  );
}

function CharRow({ label, value, unit, highlight }) {
  return (
    <div className={`char-row ${highlight ? 'char-row--highlight' : ''}`}>
      <span className="char-label">{label}</span>
      <span className="char-value">
        {value}{unit && <span className="char-unit"> {unit}</span>}
      </span>
    </div>
  );
}

// ─── Rule explanation ─────────────────────────────────────────────────────────
const RULES = [
  { key: '',              label: '— Select a rule —' },
  { key: 'basics',        label: 'Root Locus Basics' },
  { key: 'startEnd',      label: 'Start & End Points (K→0, K→∞)' },
  { key: 'realAxis',      label: 'Real-Axis Rule' },
  { key: 'asymptotes',    label: 'Asymptotes' },
  { key: 'breakPoints',   label: 'Breakaway / Break-In Points' },
  { key: 'departure',     label: 'Angle of Departure' },
  { key: 'arrival',       label: 'Angle of Arrival' },
  { key: 'imagCrossings', label: 'Imaginary-Axis Crossings' },
  { key: 'gainFormula',   label: 'Gain Formula K = |D(s)|/|N(s)|' },
];

function buildExplanation(rule, overlayData) {
  switch (rule) {
    case 'basics':
      return (
        <>
          <p>The <strong>root locus</strong> shows how the closed-loop poles of <em>1 + K·G(s) = 0</em> move as K increases from 0 to ∞.</p>
          <p>Each branch starts at an open-loop <span style={{color:'#ff6b6b'}}>pole (×)</span> and ends at an open-loop <span style={{color:'#51cf66'}}>zero (○)</span> or along an asymptote toward ∞.</p>
        </>
      );

    case 'startEnd':
      return (
        <>
          <p><strong>K → 0:</strong> Closed-loop poles → open-loop poles. The locus begins at the <span style={{color:'#ff6b6b'}}>× markers</span>.</p>
          <p><strong>K → ∞:</strong> Poles travel to open-loop zeros <span style={{color:'#51cf66'}}>○</span> (if they exist) or escape to ∞ along asymptotes.</p>
          <p>Number of branches departing to ∞ = <em>n − m</em> (poles minus zeros).</p>
        </>
      );

    case 'realAxis':
      return (
        <>
          <p>A point on the real axis lies on the locus if and only if the <strong>total number of real open-loop poles and zeros to its right is odd</strong>.</p>
          {overlayData?.realAxisSegments?.length > 0 && (
            <p>Locus segments found: {overlayData.realAxisSegments.map((s, i) => {
              const lo = isFinite(s.x0) ? s.x0.toFixed(3) : '−∞';
              const hi = isFinite(s.x1) ? s.x1.toFixed(3) : '+∞';
              return <span key={i} style={{fontFamily:'monospace'}}>[{lo}, {hi}] </span>;
            })}</p>
          )}
        </>
      );

    case 'asymptotes': {
      const a = overlayData?.asymptotes;
      return (
        <>
          <p>For <em>n − m</em> excess poles, there are <em>n − m</em> asymptotes as |s| → ∞.</p>
          <p><strong>Centroid:</strong> σ_a = (Σ poles − Σ zeros) / (n − m)</p>
          <p><strong>Angles:</strong> θ_k = (2k + 1)·180° / (n − m),&nbsp; k = 0, 1, …</p>
          {a && (
            <div style={{fontFamily:'monospace', fontSize:11, marginTop:6}}>
              σ_a = {a.centroid.toFixed(4)}<br />
              Angles: {a.angles.map(r => (r * 180 / Math.PI).toFixed(1) + '°').join(', ')}
            </div>
          )}
        </>
      );
    }

    case 'breakPoints': {
      const bps = overlayData?.breakPoints;
      return (
        <>
          <p>Break points are real-axis points where two or more locus branches meet and then split (or merge from complex plane to real axis).</p>
          <p>Found by solving: <strong>N(s)·D′(s) − D(s)·N′(s) = 0</strong></p>
          {bps?.length > 0 && (
            <div style={{fontFamily:'monospace', fontSize:11, marginTop:6}}>
              {bps.map((b, i) => <div key={i}>σ = {b.x.toFixed(4)}, K = {b.K.toFixed(4)}</div>)}
            </div>
          )}
          {bps?.length === 0 && <p><em>None found for this transfer function.</em></p>}
        </>
      );
    }

    case 'departure': {
      const deps = overlayData?.departures;
      return (
        <>
          <p>The <strong>angle of departure</strong> from a complex pole p_k is the initial direction the locus takes as K increases from 0.</p>
          <p>φ_dep = 180° + Σ∠(p_k − z_i) − Σ∠(p_k − p_j, j≠k)</p>
          {deps?.length > 0 && (
            <div style={{fontFamily:'monospace', fontSize:11, marginTop:6}}>
              {deps.map((d, i) => (
                <div key={i}>p = {complexStr(d.pole)}: {fmtDeg(d.angle)}</div>
              ))}
            </div>
          )}
          {!deps?.length && <p><em>No complex poles — rule does not apply.</em></p>}
        </>
      );
    }

    case 'arrival': {
      const arrs = overlayData?.arrivals;
      return (
        <>
          <p>The <strong>angle of arrival</strong> at a complex zero z_k is the final direction the locus approaches as K → ∞.</p>
          <p>φ_arr = 180° + Σ∠(z_k − p_j) − Σ∠(z_k − z_i, i≠k)</p>
          {arrs?.length > 0 && (
            <div style={{fontFamily:'monospace', fontSize:11, marginTop:6}}>
              {arrs.map((a, i) => (
                <div key={i}>z = {complexStr(a.zero)}: {fmtDeg(a.angle)}</div>
              ))}
            </div>
          )}
          {!arrs?.length && <p><em>No complex zeros — rule does not apply.</em></p>}
        </>
      );
    }

    case 'imagCrossings': {
      const xings = overlayData?.imagCrossings;
      return (
        <>
          <p>The locus crosses the imaginary axis when the closed-loop system transitions between stable and unstable.</p>
          <p>At s = jω: solve D(jω) + K·N(jω) = 0 for real K &gt; 0.</p>
          <p>Equivalently: Im(D(jω)/N(jω)) = 0 &amp;&amp; Re(D(jω)/N(jω)) &lt; 0.</p>
          {xings?.length > 0 && (
            <div style={{fontFamily:'monospace', fontSize:11, marginTop:6}}>
              {xings.map((c, i) => (
                <div key={i}>ω = ±{c.omega.toFixed(4)} rad/s, K = {c.K.toFixed(4)}</div>
              ))}
            </div>
          )}
          {xings?.length === 0 && <p><em>No imaginary-axis crossings found (or system always stable/unstable).</em></p>}
        </>
      );
    }

    case 'gainFormula':
      return (
        <>
          <p>At any point s on the root locus, the corresponding gain is:</p>
          <div style={{fontFamily:'monospace', textAlign:'center', margin:'8px 0', color:'#00d4ff'}}>
            K = |D(s)| / |N(s)|
          </div>
          <p>Click any point on the plot to evaluate K there. Use the K slider or click to highlight closed-loop poles.</p>
        </>
      );

    default: return null;
  }
}

function RuleExplainer({ overlayData, selectedRule, onSelectRule }) {
  const explanation = buildExplanation(selectedRule, overlayData);
  return (
    <div className="rule-explainer">
      <div className="section-title-small">Rule Explanation</div>
      <select
        className="rule-select"
        value={selectedRule ?? ''}
        onChange={e => onSelectRule(e.target.value)}
      >
        {RULES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
      </select>
      {explanation && (
        <div className="rule-text">{explanation}</div>
      )}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export default function InfoPanel({ poles, zeros, chars, selectedK, overlayData, selectedRule, onSelectRule }) {
  const hasChars = chars && (chars.zeta !== null || chars.settlingTime !== null);

  return (
    <div className="panel info-panel">
      <div className="panel-title">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        System Information
      </div>

      <section className="info-section">
        <div className="section-title-small">Poles &amp; Zeros</div>
        <PolesZerosTable poles={poles} zeros={zeros} />
      </section>

      {chars && (
        <>
          <div className="divider" />
          <section className="info-section">
            <div className="section-title-small" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Characteristics
              {selectedK !== null && selectedK !== undefined && (
                <span className="k-badge">K = {Number(selectedK).toFixed(4)}</span>
              )}
              <StabilityBadge isStable={chars.isStable} />
            </div>
            <div className="chars-grid">
              <CharRow label="Damping Ratio ζ"   value={fmt(chars.zeta, '', 4)}       highlight={chars.zeta !== null && chars.zeta < 0.707} />
              <CharRow label="Natural Freq ωₙ"   value={fmt(chars.omegaN, 'rad/s', 4)} />
              <CharRow label="Damped Freq ωd"    value={fmt(chars.omegaD, 'rad/s', 4)} />
              <CharRow label="Settling Time (2%)" value={fmt(chars.settlingTime, 's', 4)} highlight />
              <CharRow label="Peak Time"          value={fmt(chars.peakTime, 's', 4)} />
              <CharRow label="Rise Time"          value={fmt(chars.riseTime, 's', 4)} />
              <CharRow label="% Overshoot"        value={fmt(chars.overshoot, '%', 2)} highlight={chars.overshoot > 0} />
              <CharRow label="Steady-State"       value={fmt(chars.steadyState, '', 4)} />
              <CharRow label="System Type"        value={chars.systemType ?? '—'} />
            </div>
          </section>

          {chars.clPoles?.length > 0 && (
            <>
              <div className="divider" />
              <section className="info-section">
                <div className="section-title-small">Closed-Loop Poles</div>
                <div className="cl-poles">
                  {chars.clPoles.map((p, i) => (
                    <div key={i} className={`cl-pole ${p.re > 0 ? 'cl-pole--unstable' : ''}`}>
                      {complexStr(p)}
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}

      {!chars && (
        <div className="info-placeholder" style={{ flex: 'none', padding: '16px 0 0' }}>
          Click any point on the locus or use the K slider to analyse characteristics.
        </div>
      )}

      <div className="divider" />

      <section className="info-section">
        <RuleExplainer
          overlayData={overlayData}
          selectedRule={selectedRule}
          onSelectRule={onSelectRule}
        />
      </section>
    </div>
  );
}
