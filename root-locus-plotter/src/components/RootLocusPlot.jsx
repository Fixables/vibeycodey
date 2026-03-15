import { useEffect, useRef, useState, useCallback } from 'react';
import Plotly from 'plotly.js-dist-min';
import { gainAtPoint } from '../utils/characteristics';

function complexStr(r, d = 3) {
  if (!r) return '—';
  if (Math.abs(r.im) < 1e-6) return r.re.toFixed(d);
  const sign = r.im >= 0 ? '+' : '-';
  return `${r.re.toFixed(d)} ${sign} ${Math.abs(r.im).toFixed(d)}j`;
}

// ─── Axis range from poles/zeros only ────────────────────────────────────────
function computeAxisRange(poles, zeros) {
  const pts = [...(poles ?? []), ...(zeros ?? [])];
  if (pts.length === 0) return { xMin: -5, xMax: 1, yMin: -4, yMax: 4 };

  const re = pts.map(p => p.re);
  const im = pts.map(p => Math.abs(p.im));

  const xMin = Math.min(...re);
  const xMax = Math.max(...re);
  const yMax = Math.max(...im, 0);

  const spanX = Math.max(xMax - xMin, 1);
  const spanY = Math.max(yMax * 2, 1);
  const span  = Math.max(spanX, spanY);
  const pad   = span * 0.6;

  return {
    xMin: xMin - pad,
    xMax: Math.max(xMax + pad * 0.3, 0.5), // keep the imaginary axis visible
    yMin: -(yMax + pad * 0.6),
    yMax:   yMax + pad * 0.6,
  };
}

// ─── Overlay traces ───────────────────────────────────────────────────────────
function buildOverlayTraces(overlayData, toggles, poles, zeros, kPoles, axisRange) {
  if (!overlayData) return [];
  const traces = [];
  const { xMin, xMax, yMin, yMax } = axisRange;
  const plotSpan = Math.max(xMax - xMin, yMax - yMin);

  // ── Real-axis locus segments ──────────────────────────────────────────────
  if (toggles.realAxisLocus && overlayData.realAxisSegments) {
    for (const { x0, x1 } of overlayData.realAxisSegments) {
      const lo = isFinite(x0) ? x0 : xMin - plotSpan;
      const hi = isFinite(x1) ? x1 : xMax + plotSpan;
      traces.push({
        x: [lo, hi], y: [0, 0],
        mode: 'lines',
        line: { color: 'rgba(255,215,0,0.55)', width: 6 },
        name: 'Real-Axis Locus',
        showlegend: traces.findIndex(t => t.name === 'Real-Axis Locus') === -1,
        hoverinfo: 'skip',
        legendgroup: 'real-axis',
      });
    }
  }

  // ── Asymptotes ────────────────────────────────────────────────────────────
  if (toggles.asymptotes && overlayData.asymptotes) {
    const { centroid, angles } = overlayData.asymptotes;
    const reach = plotSpan * 3;
    for (const angle of angles) {
      traces.push({
        x: [centroid, centroid + reach * Math.cos(angle)],
        y: [0,        reach * Math.sin(angle)],
        mode: 'lines',
        line: { color: 'rgba(180,120,255,0.6)', width: 1.5, dash: 'dashdot' },
        name: 'Asymptotes',
        showlegend: traces.findIndex(t => t.name === 'Asymptotes') === -1,
        hoverinfo: 'skip',
        legendgroup: 'asymptotes',
      });
      // Opposite direction
      traces.push({
        x: [centroid, centroid - reach * Math.cos(angle)],
        y: [0,        -reach * Math.sin(angle)],
        mode: 'lines',
        line: { color: 'rgba(180,120,255,0.6)', width: 1.5, dash: 'dashdot' },
        showlegend: false,
        hoverinfo: 'skip',
        legendgroup: 'asymptotes',
      });
    }
    // Centroid marker
    traces.push({
      x: [centroid], y: [0],
      mode: 'markers',
      marker: { symbol: 'diamond', size: 10, color: '#b478ff', line: { width: 1.5, color: '#fff' } },
      name: 'Asym. Centroid',
      hovertemplate: `Centroid σ_a = ${centroid.toFixed(3)}<extra></extra>`,
      legendgroup: 'asymptotes',
    });
  }

  // ── Breakaway / break-in points ───────────────────────────────────────────
  if (toggles.breakPoints && overlayData.breakPoints?.length) {
    traces.push({
      x: overlayData.breakPoints.map(b => b.x),
      y: overlayData.breakPoints.map(() => 0),
      mode: 'markers',
      marker: { symbol: 'diamond', size: 12, color: '#ff922b', line: { width: 2, color: '#fff' } },
      name: 'Break Points',
      hovertemplate: 'Break: σ=%{x:.3f}, K=%{customdata:.4f}<extra></extra>',
      customdata: overlayData.breakPoints.map(b => b.K),
    });
  }

  // ── Angles of departure ───────────────────────────────────────────────────
  if (toggles.angleDeparture && overlayData.departures?.length) {
    const arrowLen = plotSpan * 0.12;
    for (const { pole, angle } of overlayData.departures) {
      const rad = angle * Math.PI / 180;
      const x1  = pole.re + arrowLen * Math.cos(rad);
      const y1  = pole.im + arrowLen * Math.sin(rad);
      traces.push({
        x: [pole.re, x1], y: [pole.im, y1],
        mode: 'lines+markers',
        line: { color: '#ff6b6b', width: 2 },
        marker: { symbol: 'arrow', size: 8, color: '#ff6b6b', angleref: 'previous' },
        name: 'Departure Angle',
        showlegend: traces.findIndex(t => t.name === 'Departure Angle') === -1,
        hovertemplate: `Dep. angle: ${angle.toFixed(1)}°<extra></extra>`,
        legendgroup: 'departure',
      });
    }
  }

  // ── Angles of arrival ─────────────────────────────────────────────────────
  if (toggles.angleArrival && overlayData.arrivals?.length) {
    const arrowLen = plotSpan * 0.12;
    for (const { zero, angle } of overlayData.arrivals) {
      const rad = (angle + 180) * Math.PI / 180; // arrow points toward zero
      const x0  = zero.re + arrowLen * Math.cos(rad);
      const y0  = zero.im + arrowLen * Math.sin(rad);
      traces.push({
        x: [x0, zero.re], y: [y0, zero.im],
        mode: 'lines+markers',
        line: { color: '#51cf66', width: 2 },
        marker: { symbol: 'arrow', size: 8, color: '#51cf66', angleref: 'previous' },
        name: 'Arrival Angle',
        showlegend: traces.findIndex(t => t.name === 'Arrival Angle') === -1,
        hovertemplate: `Arr. angle: ${angle.toFixed(1)}°<extra></extra>`,
        legendgroup: 'arrival',
      });
    }
  }

  // ── Imaginary-axis crossings ──────────────────────────────────────────────
  if (toggles.imagCrossings && overlayData.imagCrossings?.length) {
    const xs = [], ys = [], ks = [];
    for (const { omega, K } of overlayData.imagCrossings) {
      xs.push(0, 0); ys.push(omega, -omega); ks.push(K, K);
    }
    traces.push({
      x: xs, y: ys,
      mode: 'markers',
      marker: { symbol: 'circle', size: 12, color: '#ffd43b', line: { width: 2, color: '#000' } },
      name: 'jω Crossings',
      hovertemplate: 'jω crossing: ω=%{y:.3f}, K=%{customdata:.4f}<extra></extra>',
      customdata: ks,
    });
  }

  // ── Closed-loop poles at selected K ──────────────────────────────────────
  if (toggles.kMarkers && kPoles?.length) {
    traces.push({
      x: kPoles.map(p => p.re),
      y: kPoles.map(p => p.im),
      mode: 'markers',
      marker: { symbol: 'star', size: 14, color: '#fff', line: { width: 1.5, color: '#00d4ff' } },
      name: 'CL Poles @ K',
      hovertemplate: 'CL pole: σ=%{x:.3f}, jω=%{y:.3f}<extra></extra>',
    });
  }

  return traces;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RootLocusPlot({
  branches, openLoopPoles, openLoopZeros,
  num, den, onSelectK,
  overlayData, overlayToggles, kPoles,
}) {
  const divRef       = useRef(null);
  const [hoveredGain, setHoveredGain] = useState(null);

  const buildTraces = useCallback(() => {
    const traces = [];
    const palette = [
      '#00d4ff', '#ff6b6b', '#51cf66', '#ffd43b',
      '#cc5de8', '#ff922b', '#74c0fc', '#f783ac',
    ];

    // Reference axes
    traces.push({
      x: [-1e4, 1e4], y: [0, 0],
      mode: 'lines',
      line: { color: 'rgba(255,255,255,0.08)', width: 1, dash: 'dot' },
      showlegend: false, hoverinfo: 'skip',
    });
    traces.push({
      x: [0, 0], y: [-1e4, 1e4],
      mode: 'lines',
      line: { color: 'rgba(255,255,255,0.08)', width: 1, dash: 'dot' },
      showlegend: false, hoverinfo: 'skip',
    });

    // Overlay traces (rendered under branches so locus is on top)
    const axisRange = computeAxisRange(openLoopPoles, openLoopZeros);
    const ovTraces  = buildOverlayTraces(
      overlayData, overlayToggles ?? {}, openLoopPoles, openLoopZeros, kPoles, axisRange,
    );
    traces.push(...ovTraces);

    // Root locus branches
    branches.forEach((branch, i) => {
      traces.push({
        x: branch.re, y: branch.im,
        mode: 'lines',
        line: { color: palette[i % palette.length], width: 2 },
        name: `Branch ${i + 1}`,
        hovertemplate: 'σ: %{x:.3f}<br>jω: %{y:.3f}<extra>Branch ' + (i + 1) + '</extra>',
      });
    });

    // Open-loop poles ×
    if (openLoopPoles?.length) {
      traces.push({
        x: openLoopPoles.map(p => p.re), y: openLoopPoles.map(p => p.im),
        mode: 'markers',
        marker: { symbol: 'x', size: 14, color: '#ff6b6b', line: { width: 2.5 } },
        name: 'OL Poles',
        hovertemplate: 'Pole: %{x:.3f}+%{y:.3f}j<extra></extra>',
      });
    }

    // Open-loop zeros ○
    if (openLoopZeros?.length) {
      traces.push({
        x: openLoopZeros.map(z => z.re), y: openLoopZeros.map(z => z.im),
        mode: 'markers',
        marker: { symbol: 'circle-open', size: 14, color: '#51cf66', line: { width: 2.5 } },
        name: 'OL Zeros',
        hovertemplate: 'Zero: %{x:.3f}+%{y:.3f}j<extra></extra>',
      });
    }

    return traces;
  }, [branches, openLoopPoles, openLoopZeros, overlayData, overlayToggles, kPoles]);

  useEffect(() => {
    if (!divRef.current || !branches) return;

    const traces    = buildTraces();
    const axisRange = computeAxisRange(openLoopPoles, openLoopZeros);

    const layout = {
      paper_bgcolor: 'transparent',
      plot_bgcolor:  'rgba(15,23,42,0.6)',
      font: { color: '#94a3b8', family: 'Inter, system-ui, sans-serif', size: 12 },
      xaxis: {
        title:       { text: 'Real Axis (σ)', font: { color: '#64748b' } },
        gridcolor:   'rgba(255,255,255,0.05)',
        zerolinecolor:'rgba(255,255,255,0.15)',
        tickcolor:   '#334155',
        linecolor:   '#334155',
        range:       [axisRange.xMin, axisRange.xMax],
      },
      yaxis: {
        title:       { text: 'Imaginary Axis (jω)', font: { color: '#64748b' } },
        gridcolor:   'rgba(255,255,255,0.05)',
        zerolinecolor:'rgba(255,255,255,0.15)',
        tickcolor:   '#334155',
        linecolor:   '#334155',
        range:       [axisRange.yMin, axisRange.yMax],
        scaleanchor: 'x', scaleratio: 1,
      },
      legend: {
        bgcolor: 'rgba(15,23,42,0.8)', bordercolor: '#1e293b',
        borderwidth: 1, font: { color: '#94a3b8' },
      },
      margin:    { l: 60, r: 20, t: 20, b: 50 },
      hovermode: 'closest',
    };

    const config = {
      displayModeBar: true,
      modeBarButtonsToRemove: ['select2d', 'lasso2d', 'toImage'],
      displaylogo: false, responsive: true,
    };

    Plotly.react(divRef.current, traces, layout, config);

    divRef.current.on('plotly_click', data => {
      if (!data.points?.length) return;
      const pt = data.points[0];
      const s  = { re: pt.x, im: pt.y };
      const K  = gainAtPoint(num, den, s);
      if (K !== null && onSelectK) {
        onSelectK(K, s);
        setHoveredGain({ K, s });
      }
    });
  }, [branches, openLoopPoles, openLoopZeros, num, den, onSelectK, buildTraces]);

  return (
    <div className="plot-wrapper">
      <div ref={divRef} style={{ width: '100%', height: '100%' }} />
      {hoveredGain && (
        <div className="plot-tooltip">
          <span>s = {complexStr(hoveredGain.s)}</span>
          <span>K = {hoveredGain.K.toFixed(4)}</span>
        </div>
      )}
    </div>
  );
}
