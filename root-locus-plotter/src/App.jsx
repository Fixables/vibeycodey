import { useState, useCallback, useEffect } from 'react';
import InputPanel from './components/InputPanel';
import RootLocusPlot from './components/RootLocusPlot';
import InfoPanel from './components/InfoPanel';
import { parsePolynomial } from './utils/polymath';
import { polyRoots } from './utils/rootFinder';
import { computeRootLocus, buildOpenLoopTF } from './utils/rootLocus';
import { computeCharacteristics } from './utils/characteristics';
import { computeOverlays } from './utils/overlays';
import './App.css';

const DEFAULTS = {
  numStr: '1',
  denStr: 's(s+1)(s+3)',
  controller: { enabled: false, zc: 1, pc: 5 },
};

const OVERLAY_DEFAULTS = {
  realAxisLocus:  false,
  asymptotes:     false,
  breakPoints:    false,
  angleDeparture: false,
  angleArrival:   false,
  imagCrossings:  false,
  kMarkers:       true,
};

export default function App() {
  const [numStr,     setNumStr]     = useState(DEFAULTS.numStr);
  const [denStr,     setDenStr]     = useState(DEFAULTS.denStr);
  const [controller, setController] = useState(DEFAULTS.controller);
  const [numError,   setNumError]   = useState('');
  const [denError,   setDenError]   = useState('');
  const [plotData,   setPlotData]   = useState(null);
  const [chars,      setChars]      = useState(null);
  const [selectedK,  setSelectedK]  = useState(null);
  const [computing,  setComputing]  = useState(false);

  // Overlay state
  const [overlayToggles, setOverlayToggles] = useState(OVERLAY_DEFAULTS);
  const [overlayData,    setOverlayData]    = useState(null);
  const [selectedRule,   setSelectedRule]   = useState('');

  const handleApply = useCallback(() => {
    setNumError(''); setDenError('');
    setChars(null); setSelectedK(null);
    setComputing(true);

    setTimeout(() => {
      let baseNum, baseDen;
      try {
        baseNum = parsePolynomial(numStr);
        if (!baseNum || baseNum.every(c => Math.abs(c) < 1e-12)) {
          setNumError('Invalid or zero polynomial'); setComputing(false); return;
        }
      } catch (e) {
        setNumError(e.message || 'Could not parse numerator'); setComputing(false); return;
      }
      try {
        baseDen = parsePolynomial(denStr);
        if (!baseDen || baseDen.every(c => Math.abs(c) < 1e-12)) {
          setDenError('Invalid or zero polynomial'); setComputing(false); return;
        }
      } catch (e) {
        setDenError(e.message || 'Could not parse denominator'); setComputing(false); return;
      }

      if (baseDen.length < baseNum.length) {
        setDenError('Denominator degree must be ≥ numerator degree');
        setComputing(false); return;
      }

      const { num, den } = buildOpenLoopTF(baseNum, baseDen, controller);
      const poles  = polyRoots(den);
      // num may be degree ≥ 1 after controller multiplication
      const zeros  = num.length > 1 ? polyRoots(num) : [];

      const branches = computeRootLocus(num, den);
      const overlays = computeOverlays(num, den, poles, zeros);

      setPlotData({ num, den, poles, zeros, branches });
      setOverlayData(overlays);

      const initK = 1;
      const c1 = computeCharacteristics(num, den, initK);
      setChars(c1);
      setSelectedK(initK);
      setComputing(false);
    }, 10);
  }, [numStr, denStr, controller]);

  useEffect(() => { handleApply(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectK = useCallback((K) => {
    if (!plotData) return;
    const c = computeCharacteristics(plotData.num, plotData.den, K);
    setChars(c);
    setSelectedK(K);
  }, [plotData]);

  const handleOverlayToggle = useCallback((key) => {
    setOverlayToggles(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Closed-loop pole markers for the K slider / click selection
  const kPoles = overlayToggles.kMarkers && chars?.clPoles
    ? chars.clPoles
    : null;

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2">
            <polyline points="4 19 8 13 12 15 16 7 20 5" />
            <line x1="4" y1="19" x2="20" y2="19" />
            <line x1="4" y1="5" x2="4" y2="19" />
            <circle cx="8"  cy="13" r="1.5" fill="#ff6b6b" stroke="none" />
            <circle cx="12" cy="15" r="1.5" fill="#ff6b6b" stroke="none" />
            <circle cx="16" cy="7"  r="1.5" fill="#ff6b6b" stroke="none" />
          </svg>
          <span className="app-title">Root Locus Plotter</span>
        </div>
        <span className="app-subtitle">Control Systems Analysis &mdash; 1 + K · G(s) = 0</span>
      </header>

      <main className="app-main">
        <InputPanel
          numStr={numStr}       denStr={denStr}
          controller={controller}
          onNumChange={setNumStr} onDenChange={setDenStr}
          onControllerChange={setController}
          onApply={handleApply}
          numError={numError}   denError={denError}
          overlayToggles={overlayToggles}
          onOverlayToggle={handleOverlayToggle}
          selectedK={selectedK}
          onKChange={handleSelectK}
        />

        <div className="panel plot-panel">
          <div className="panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="M7 12l4-4 4 4 4-6" />
            </svg>
            Root Locus
            <span className="panel-hint">Click a point to evaluate characteristics · Use K slider to move poles</span>
          </div>

          {computing && (
            <div className="plot-loading">
              <div className="spinner" />
              <span>Computing root locus…</span>
            </div>
          )}

          {!computing && plotData ? (
            <RootLocusPlot
              branches={plotData.branches}
              openLoopPoles={plotData.poles}
              openLoopZeros={plotData.zeros}
              num={plotData.num}
              den={plotData.den}
              onSelectK={handleSelectK}
              overlayData={overlayData}
              overlayToggles={overlayToggles}
              kPoles={kPoles}
            />
          ) : !computing ? (
            <div className="plot-empty">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5">
                <path d="M3 3v18h18" />
                <path d="M7 16s1-5 3-7 4-1 6-3" />
              </svg>
              <p>Enter a transfer function and click "Plot Root Locus"</p>
            </div>
          ) : null}
        </div>

        <InfoPanel
          poles={plotData?.poles}
          zeros={plotData?.zeros?.length ? plotData.zeros : null}
          chars={chars}
          selectedK={selectedK}
          overlayData={overlayData}
          selectedRule={selectedRule}
          onSelectRule={setSelectedRule}
        />
      </main>
    </div>
  );
}
