'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { parseSql, Table, Relationship } from '@/lib/sql-parser';
import toast from 'react-hot-toast';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const TABLE_WIDTH = 280;
const HEADER_HEIGHT = 44;
const ROW_HEIGHT = 30;
const CANVAS_W = 4000;
const CANVAS_H = 2400;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 2.0;
const ZOOM_STEP = 0.1;

const TABLE_COLORS = [
  '#6366f1','#ec4899','#10b981','#3b82f6',
  '#f59e0b','#8b5cf6','#ef4444','#14b8a6',
  '#f97316','#06b6d4','#84cc16','#a855f7',
];

// Light-mode variants: same hue but slightly more saturated / darker for readability
const TABLE_COLORS_LIGHT = [
  '#4f46e5','#db2777','#059669','#2563eb',
  '#d97706','#7c3aed','#dc2626','#0d9488',
  '#ea580c','#0891b2','#65a30d','#9333ea',
];

const DEFAULT_SQL = `CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  role_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  parent_id INT,
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  category_id INT NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);`;

interface Design {
  _id: string; name: string; description: string;
  sql: string; tablePositions: Record<string, { x: number; y: number }>; updatedAt: string;
}

function encodeSQL(s: string) { try { return btoa(unescape(encodeURIComponent(s))); } catch { return btoa(s); } }
function decodeSQL(s: string) { try { return decodeURIComponent(escape(atob(s))); } catch { return atob(s); } }

function autoLayout(tables: Table[]) {
  const positions: Record<string, { x: number; y: number }> = {};
  const n = tables.length;
  if (n === 0) return positions;

  // Square-ish grid: aim for roughly equal width & height spread
  const COLS = Math.min(Math.max(2, Math.ceil(Math.sqrt(n * 1.4))), 10);
  const COL_GAP = 120;  // wider horizontal spacing
  const ROW_GAP = 55;

  // Track the bottom Y of each column so we can pack shortest-column first
  const colH = new Array(COLS).fill(70);

  // Sort tallest tables first for tighter packing (bin-packing heuristic)
  const sorted = [...tables].sort((a, b) => b.columns.length - a.columns.length);

  sorted.forEach(tbl => {
    // Place into the column that currently has the smallest total height
    const c = colH.indexOf(Math.min(...colH));
    positions[tbl.name] = { x: 70 + c * (TABLE_WIDTH + COL_GAP), y: colH[c] };
    colH[c] += HEADER_HEIGHT + tbl.columns.length * ROW_HEIGHT + ROW_GAP;
  });

  return positions;
}

// ── Theme tokens ─────────────────────────────────────────────────────────────
function makeTheme(dark: boolean) {
  return dark ? {
    root: '#0b0d14',
    canvasBg: '#0b0d14',
    dotColor: 'rgba(99,102,241,0.15)',
    toolbarBg: 'rgba(14,16,24,0.98)',
    toolbarBorder: 'rgba(255,255,255,0.07)',
    subHeaderBg: 'rgba(255,255,255,0.02)',
    subHeaderBorder: 'rgba(255,255,255,0.05)',
    editorBg: 'rgba(255,255,255,0.03)',
    editorBorder: 'rgba(255,255,255,0.06)',
    cardBg: '#13162a',
    cardBorder: 'rgba(255,255,255,0.09)',
    cardDivider: 'rgba(255,255,255,0.04)',
    cardLeftBorderAlpha: '55',
    colName: '#c7d2e8',
    colType: 'rgba(148,163,184,0.4)',
    pkText: '#fde68a',
    fkText: '#93c5fd',
    labelColor: 'rgba(255,255,255,0.22)',
    mutedText: 'rgba(255,255,255,0.30)',
    faintText: 'rgba(255,255,255,0.15)',
    badgeBg: 'rgba(255,255,255,0.04)',
    badgeBorder: 'rgba(255,255,255,0.07)',
    badgeText: 'rgba(255,255,255,0.5)',
    iconColor: 'rgba(255,255,255,0.55)',
    iconHover: 'rgba(255,255,255,0.90)',
    dividerColor: 'rgba(255,255,255,0.10)',
    btnMutedBg: 'rgba(255,255,255,0.06)',
    btnMutedBorder: 'rgba(255,255,255,0.10)',
    btnMutedText: 'rgba(255,255,255,0.65)',
    btnMutedHoverBg: 'rgba(255,255,255,0.11)',
    modalBg: '#13162a',
    modalBorder: 'rgba(255,255,255,0.10)',
    inputBg: 'rgba(255,255,255,0.06)',
    inputBorder: 'rgba(255,255,255,0.10)',
    inputText: '#ffffff',
    watermarkColor: '#ffffff',
    editorTheme: 'vs-dark',
    colorsArr: TABLE_COLORS,
    logoText: 'text-white',
    titleText: 'rgba(255,255,255,0.45)',
    chipBg: 'rgba(99,102,241,0.12)',
    chipBorder: 'rgba(99,102,241,0.25)',
    chipText: '#a5b4fc',
    headerText: '#ffffff',
  } : {
    root: '#f5f6fa',
    canvasBg: '#eef0f8',
    dotColor: 'rgba(80,90,140,0.10)',
    toolbarBg: '#ffffff',
    toolbarBorder: 'rgba(0,0,0,0.08)',
    subHeaderBg: 'rgba(0,0,0,0.02)',
    subHeaderBorder: 'rgba(0,0,0,0.06)',
    editorBg: 'rgba(0,0,0,0.02)',
    editorBorder: 'rgba(0,0,0,0.06)',
    cardBg: '#ffffff',
    cardBorder: 'rgba(0,0,0,0.12)',
    cardDivider: 'rgba(0,0,0,0.05)',
    cardLeftBorderAlpha: 'cc',
    colName: '#1e2030',
    colType: 'rgba(70,80,120,0.50)',
    pkText: '#92400e',
    fkText: '#1d4ed8',
    labelColor: 'rgba(0,0,0,0.30)',
    mutedText: 'rgba(0,0,0,0.40)',
    faintText: 'rgba(0,0,0,0.18)',
    badgeBg: 'rgba(0,0,0,0.04)',
    badgeBorder: 'rgba(0,0,0,0.08)',
    badgeText: 'rgba(0,0,0,0.55)',
    iconColor: 'rgba(0,0,0,0.45)',
    iconHover: 'rgba(0,0,0,0.85)',
    dividerColor: 'rgba(0,0,0,0.10)',
    btnMutedBg: 'rgba(0,0,0,0.05)',
    btnMutedBorder: 'rgba(0,0,0,0.10)',
    btnMutedText: 'rgba(0,0,0,0.60)',
    btnMutedHoverBg: 'rgba(0,0,0,0.09)',
    modalBg: '#ffffff',
    modalBorder: 'rgba(0,0,0,0.12)',
    inputBg: 'rgba(0,0,0,0.04)',
    inputBorder: 'rgba(0,0,0,0.12)',
    inputText: '#0f1117',
    watermarkColor: '#000000',
    editorTheme: 'vs',
    colorsArr: TABLE_COLORS_LIGHT,
    logoText: 'text-gray-900',
    titleText: 'rgba(0,0,0,0.40)',
    chipBg: 'rgba(99,102,241,0.08)',
    chipBorder: 'rgba(99,102,241,0.20)',
    chipText: '#4338ca',
    headerText: '#ffffff',
  };
}

export default function DbDesignClient() {
  const { data: session } = useSession();
  const [sql, setSql] = useState(DEFAULT_SQL);
  const [tables, setTables] = useState<Table[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDesignsPanel, setShowDesignsPanel] = useState(false);
  const [designName, setDesignName] = useState('');
  const [designDesc, setDesignDesc] = useState('');
  const [currentDesignId, setCurrentDesignId] = useState<string | null>(null);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const [tableColorMap, setTableColorMap] = useState<Record<string, string>>({});
  const [isCanvasOnly, setIsCanvasOnly] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDark, setIsDark] = useState(false);          // default: light
  const [fkExpanded, setFkExpanded] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const dragging = useRef<{ table: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const canvasScrollRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const t = makeTheme(isDark);

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('db-design-theme');
    if (saved === 'dark') setIsDark(true);

    const params = new URLSearchParams(window.location.search);
    const shared = params.get('s');
    if (shared) {
      try { const decoded = decodeSQL(shared); setSql(decoded); handleParse(decoded, {}); toast.success('Shared design loaded'); }
      catch { handleParse(DEFAULT_SQL, {}); }
    } else {
      handleParse(DEFAULT_SQL, {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('db-design-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // Ctrl+scroll to zoom
  useEffect(() => {
    const el = canvasScrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom(prev => +Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prev - e.deltaY * 0.001)).toFixed(2));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ── Parse ─────────────────────────────────────────────────────────────────
  function handleParse(sqlToParse: string = sql, existingPositions: Record<string, { x: number; y: number }> = positions) {
    const result = parseSql(sqlToParse);
    setTables(result.tables);
    setRelationships(result.relationships);
    setErrors(result.errors);
    const newLayout = autoLayout(result.tables);
    const merged: Record<string, { x: number; y: number }> = {};
    result.tables.forEach(tbl => { merged[tbl.name] = existingPositions[tbl.name] ?? newLayout[tbl.name]; });
    setPositions(merged);
    const colorMap: Record<string, string> = {};
    result.tables.forEach((tbl, i) => { colorMap[tbl.name] = TABLE_COLORS[i % TABLE_COLORS.length]; });
    setTableColorMap(colorMap);
    if (result.errors.length === 0 && result.tables.length > 0)
      toast.success(`Rendered ${result.tables.length} tables · ${result.relationships.length} relationships`);
  }

  // Update color map when theme changes
  useEffect(() => {
    if (tables.length === 0) return;
    const colorMap: Record<string, string> = {};
    tables.forEach((tbl, i) => { colorMap[tbl.name] = TABLE_COLORS[i % TABLE_COLORS.length]; });
    setTableColorMap(colorMap);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  // ── Drag + select (zoom-corrected) ───────────────────────────────────────
  const handleTableMouseDown = useCallback((e: React.MouseEvent, tableName: string) => {
    e.preventDefault(); e.stopPropagation();
    const pos = positions[tableName] ?? { x: 0, y: 0 };
    dragging.current = { table: tableName, startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
    // Select on click; mouseup decides if it was a real drag or a click
    setSelectedTable(prev => prev === tableName ? null : tableName);
  }, [positions]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const { table, startX, startY, origX, origY } = dragging.current;
      const z = zoomRef.current;
      const dx = (e.clientX - startX) / z;
      const dy = (e.clientY - startY) / z;
      // If significant drag, keep selection but update position
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        setPositions(prev => ({ ...prev, [table]: { x: Math.max(0, origX + dx), y: Math.max(0, origY + dy) } }));
      }
    };
    const onUp = () => { dragging.current = null; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  function handleShare() {
    try { navigator.clipboard.writeText(`${window.location.origin}/db-design?s=${encodeSQL(sql)}`); toast.success('Share link copied!'); }
    catch { toast.error('Failed to copy share link'); }
  }

  function handleFullscreen() {
    if (!outerRef.current) return;
    if (!document.fullscreenElement) outerRef.current.requestFullscreen().catch(() => toast.error('Fullscreen not supported'));
    else document.exitFullscreen();
  }

  function changeZoom(delta: number) {
    setZoom(prev => +Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, prev + delta)).toFixed(2));
  }

  async function handleSave() {
    if (!session) { toast.error('Sign in to save designs'); return; }
    if (!designName.trim()) { toast.error('Enter a design name'); return; }
    const payload = { name: designName, description: designDesc, sql, tablePositions: positions };
    try {
      if (currentDesignId) {
        await fetch(`/api/db-design/${currentDesignId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        toast.success('Design updated!');
      } else {
        const res = await fetch('/api/db-design', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        setCurrentDesignId((await res.json()).id);
        toast.success('Design saved!');
      }
      setShowSaveModal(false);
    } catch { toast.error('Failed to save design'); }
  }

  async function loadDesigns() {
    if (!session) { toast.error('Sign in to view saved designs'); return; }
    setLoadingDesigns(true); setShowDesignsPanel(true);
    try { setDesigns(await fetch('/api/db-design').then(r => r.json())); }
    catch { toast.error('Failed to load designs'); }
    finally { setLoadingDesigns(false); }
  }

  function loadDesign(d: Design) {
    setSql(d.sql); setCurrentDesignId(d._id); setDesignName(d.name); setDesignDesc(d.description);
    handleParse(d.sql, d.tablePositions ?? {}); setShowDesignsPanel(false);
    toast.success(`Loaded: ${d.name}`);
  }

  async function deleteDesign(id: string) {
    try {
      await fetch(`/api/db-design/${id}`, { method: 'DELETE' });
      setDesigns(prev => prev.filter(d => d._id !== id));
      if (currentDesignId === id) { setCurrentDesignId(null); setDesignName(''); }
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  }

  function handleNew() {
    setSql(''); setTables([]); setRelationships([]); setPositions({}); setErrors([]);
    setCurrentDesignId(null); setDesignName(''); setDesignDesc('');
    window.history.replaceState({}, '', '/db-design');
  }

  // ── SVG FK lines ──────────────────────────────────────────────────────────
  function renderLines() {
    return relationships.map((rel, i) => {
      const fromTbl = tables.find(tbl => tbl.name === rel.fromTable);
      const toTbl = tables.find(tbl => tbl.name === rel.toTable);
      const fromPos = positions[rel.fromTable];
      const toPos = positions[rel.toTable];
      if (!fromTbl || !toTbl || !fromPos || !toPos) return null;

      const fi = fromTbl.columns.findIndex(c => c.name === rel.fromColumn);
      const ti = toTbl.columns.findIndex(c => c.name === rel.toColumn);
      const y1 = fromPos.y + HEADER_HEIGHT + Math.max(0, fi) * ROW_HEIGHT + ROW_HEIGHT / 2;
      const y2 = toPos.y + HEADER_HEIGHT + Math.max(0, ti) * ROW_HEIGHT + ROW_HEIGHT / 2;
      const color = tableColorMap[rel.fromTable] ?? '#6366f1';
      const isRelSelected = selectedTable !== null &&
        (rel.fromTable === selectedTable || rel.toTable === selectedTable);
      const isRelDimmed = selectedTable !== null && !isRelSelected;

      const sw = isRelSelected ? '2.5' : isDark ? '1.5' : '1.8';
      const op = isRelDimmed ? 0.06 : isRelSelected ? 1 : isDark ? 0.75 : 0.65;

      // Self-referential: draw a loop to the left of the table
      if (rel.fromTable === rel.toTable) {
        const lx = fromPos.x - 50;
        return (
          <g key={`${rel.fromTable}-${rel.fromColumn}-${i}`} style={{ transition: 'opacity 0.18s ease' }} opacity={op}>
            <path d={`M ${fromPos.x} ${y1} C ${lx} ${y1}, ${lx} ${y2}, ${fromPos.x} ${y2}`}
              stroke={color} strokeWidth={sw} fill="none" strokeDasharray={isRelSelected ? 'none' : '5 3'} />
            <circle cx={fromPos.x} cy={y1} r={isRelSelected ? 4.5 : 3.5} fill={color} />
            <circle cx={fromPos.x} cy={y2} r={isRelSelected ? 5.5 : 4} fill={color} />
          </g>
        );
      }

      // Smart port: choose the shorter side so lines don't cross the whole canvas
      const srcCx = fromPos.x + TABLE_WIDTH / 2;
      const tgtCx = toPos.x + TABLE_WIDTH / 2;
      const goRight = srcCx <= tgtCx;
      const x1 = goRight ? fromPos.x + TABLE_WIDTH : fromPos.x;
      const x2 = goRight ? toPos.x : toPos.x + TABLE_WIDTH;
      const sign = goRight ? 1 : -1;
      const dx = Math.abs(x2 - x1);
      const cp = Math.max(40, Math.min(160, dx * 0.45));

      return (
        <g key={`${rel.fromTable}-${rel.fromColumn}-${i}`} style={{ transition: 'opacity 0.18s ease' }} opacity={op}>
          <path d={`M ${x1} ${y1} C ${x1 + sign * cp} ${y1}, ${x2 - sign * cp} ${y2}, ${x2} ${y2}`}
            stroke={color} strokeWidth={sw} fill="none" strokeDasharray={isRelSelected ? 'none' : '6 3'} />
          <circle cx={x1} cy={y1} r={isRelSelected ? 4.5 : 3.5} fill={color} />
          <circle cx={x2} cy={y2} r={isRelSelected ? 5.5 : 4} fill={color} />
        </g>
      );
    });
  }

  const tableHeight = (tbl: Table) => HEADER_HEIGHT + tbl.columns.length * ROW_HEIGHT;

  // ── Shared button styles ──────────────────────────────────────────────────
  const btnMuted = {
    background: t.btnMutedBg,
    border: `1px solid ${t.btnMutedBorder}`,
    color: t.btnMutedText,
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={outerRef} className="flex flex-col" style={{ height: '100vh', background: t.root, fontFamily: 'inherit' }}>

      {/* ══ Toolbar ══════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between px-4 shrink-0 gap-2 flex-wrap"
        style={{ height: 52, background: t.toolbarBg, borderBottom: `1px solid ${t.toolbarBorder}`, boxShadow: isDark ? 'none' : '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shadow-lg" style={{ background: '#6366f1', boxShadow: '0 2px 8px rgba(99,102,241,0.35)' }}>
            <span className="text-white font-black text-sm">D</span>
          </div>
          <span className="font-black text-base tracking-tight" style={{ color: isDark ? '#ffffff' : '#1e1b4b' }}>DevExCode</span>
          <span className="text-lg font-thin" style={{ color: t.dividerColor }}>|</span>
          <span className="text-xs font-medium" style={{ color: t.titleText }}>DB Schema Designer</span>
          {currentDesignId && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: t.chipBg, border: `1px solid ${t.chipBorder}`, color: t.chipText }}>
              {designName}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Parse */}
          <button onClick={() => handleParse()}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
            style={{ background: '#6366f1', color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.30)' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#4f46e5')}
            onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Parse &amp; Render
          </button>

          {/* Save */}
          <button onClick={() => setShowSaveModal(true)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
            style={{ background: '#059669', color: '#fff', boxShadow: '0 2px 8px rgba(5,150,105,0.25)' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#047857')}
            onMouseLeave={e => (e.currentTarget.style.background = '#059669')}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save
          </button>

          {/* My Designs */}
          <button onClick={loadDesigns}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
            style={btnMuted}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnMutedHoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnMutedBg; }}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            My Designs
          </button>

          {/* Share */}
          <button onClick={handleShare}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
            style={{ background: '#0284c7', color: '#fff', boxShadow: '0 2px 8px rgba(2,132,199,0.25)' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#0369a1')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0284c7')}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>

          <div className="w-px h-5 shrink-0" style={{ background: t.dividerColor }} />

          {/* Zoom controls */}
          <div className="flex items-center rounded-lg overflow-hidden" style={{ border: `1px solid ${t.btnMutedBorder}` }}>
            <button onClick={() => changeZoom(-ZOOM_STEP)}
              className="px-2 py-1.5 text-xs font-bold transition-all"
              style={{ background: t.btnMutedBg, color: t.btnMutedText, borderRight: `1px solid ${t.btnMutedBorder}` }}
              onMouseEnter={e => (e.currentTarget.style.background = t.btnMutedHoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = t.btnMutedBg)}
              title="Zoom out (Ctrl+scroll)">−</button>
            <span className="px-2 text-xs font-semibold tabular-nums" style={{ background: t.btnMutedBg, color: t.btnMutedText, minWidth: 42, textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => changeZoom(ZOOM_STEP)}
              className="px-2 py-1.5 text-xs font-bold transition-all"
              style={{ background: t.btnMutedBg, color: t.btnMutedText, borderLeft: `1px solid ${t.btnMutedBorder}` }}
              onMouseEnter={e => (e.currentTarget.style.background = t.btnMutedHoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = t.btnMutedBg)}
              title="Zoom in (Ctrl+scroll)">+</button>
          </div>

          {/* Theme toggle */}
          <button onClick={() => setIsDark(v => !v)}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-1.5 rounded-lg transition-all"
            style={btnMuted}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnMutedHoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnMutedBg; }}>
            {isDark ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: t.iconColor }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: t.iconColor }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Panel toggle */}
          <button onClick={() => setIsCanvasOnly(v => !v)}
            title={isCanvasOnly ? 'Show SQL editor' : 'Hide SQL editor'}
            className="p-1.5 rounded-lg transition-all"
            style={btnMuted}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnMutedHoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnMutedBg; }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: t.iconColor }}>
              {isCanvasOnly
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />}
            </svg>
          </button>

          {/* Fullscreen */}
          <button onClick={handleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded-lg transition-all"
            style={btnMuted}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnMutedHoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnMutedBg; }}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: t.iconColor }}>
              {isFullscreen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />}
            </svg>
          </button>

          {/* New */}
          <button onClick={handleNew}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
            style={btnMuted}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnMutedHoverBg; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = t.btnMutedBg; }}>
            New
          </button>
        </div>
      </div>

      {/* ══ Main split ═══════════════════════════════════════════════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: SQL editor */}
        {!isCanvasOnly && (
          <div className="flex flex-col shrink-0" style={{ width: 380, borderRight: `1px solid ${t.toolbarBorder}` }}>
            <div className="flex items-center justify-between px-3 py-2 shrink-0"
              style={{ background: t.subHeaderBg, borderBottom: `1px solid ${t.subHeaderBorder}` }}>
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: t.labelColor }}>SQL Editor</span>
              <span className="text-[10px]" style={{ color: t.faintText }}>CREATE TABLE only</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <MonacoEditor height="100%" language="sql" theme={t.editorTheme} value={sql}
                onChange={v => setSql(v ?? '')}
                options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'on', wordWrap: 'on', scrollBeyondLastLine: false, padding: { top: 12 }, tabSize: 2 }} />
            </div>
            {errors.length > 0 && (
              <div className="px-3 py-2 shrink-0"
                style={{ background: 'rgba(239,68,68,0.08)', borderTop: '1px solid rgba(239,68,68,0.15)' }}>
                {errors.map((e, i) => <p key={i} className="text-xs text-red-500">{e}</p>)}
              </div>
            )}
            {/* Legend */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 px-3 py-2 shrink-0"
              style={{ borderTop: `1px solid ${t.subHeaderBorder}`, background: t.subHeaderBg }}>
              <span className="text-[10px] font-bold" style={{ color: isDark ? '#fbbf24' : '#92400e' }}>PK <span className="font-normal" style={{ color: t.faintText }}>Primary</span></span>
              <span className="text-[10px] font-bold" style={{ color: isDark ? '#60a5fa' : '#1d4ed8' }}>FK <span className="font-normal" style={{ color: t.faintText }}>Foreign</span></span>
              <span className="text-[10px] font-bold text-red-500">* <span className="font-normal" style={{ color: t.faintText }}>NOT NULL</span></span>
              <span className="text-[10px] font-bold" style={{ color: isDark ? '#c084fc' : '#7c3aed' }}>U <span className="font-normal" style={{ color: t.faintText }}>Unique</span></span>
            </div>
          </div>
        )}

        {/* Right: ERD canvas */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Canvas sub-header */}
          <div className="flex items-center gap-3 px-3 shrink-0"
            style={{ height: 34, background: t.subHeaderBg, borderBottom: `1px solid ${t.subHeaderBorder}` }}>
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: t.labelColor }}>ERD Canvas</span>
            <span className="text-[10px]" style={{ color: t.faintText }}>Drag table headers · Ctrl+scroll to zoom</span>
            {isCanvasOnly && (
              <button onClick={() => handleParse()}
                className="px-2 py-0.5 text-[10px] font-semibold rounded transition-colors"
                style={{ background: 'rgba(99,102,241,0.10)', color: isDark ? '#a5b4fc' : '#4338ca', border: '1px solid rgba(99,102,241,0.20)' }}>
                Re-render
              </button>
            )}
            {tables.length > 0 && (
              <span className="ml-auto text-[10px]" style={{ color: t.faintText }}>
                {tables.length} tables · {relationships.length} relationships
              </span>
            )}
          </div>

          {/* Scrollable canvas */}
          <div ref={canvasScrollRef} className="flex-1 overflow-auto"
            style={{
              backgroundColor: t.canvasBg,
              backgroundImage: `radial-gradient(circle, ${t.dotColor} 1px, transparent 1px)`,
              backgroundSize: `${28 * zoom}px ${28 * zoom}px`,
            }}
            onClick={() => setSelectedTable(null)}>
            {/* Size holder accounts for zoom so scroll area is correct */}
            <div style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom }}>
              {/* Scaled canvas */}
              <div style={{ transform: `scale(${zoom})`, transformOrigin: '0 0', width: CANVAS_W, height: CANVAS_H, position: 'relative' }}>

                {/* Watermark */}
                <div className="absolute pointer-events-none select-none flex flex-col items-center justify-center gap-3"
                  style={{ left: '50%', top: '42%', transform: 'translate(-50%,-50%)', opacity: isDark ? 0.05 : 0.06, zIndex: 0 }}>
                  <div className="flex items-center gap-5">
                    <div style={{ width: 80, height: 80, background: '#6366f1', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#fff', fontWeight: 900, fontSize: 44 }}>D</span>
                    </div>
                    <span style={{ color: t.watermarkColor, fontWeight: 900, fontSize: 72, letterSpacing: '-0.03em', lineHeight: 1 }}>DevExCode</span>
                  </div>
                  <span style={{ color: t.watermarkColor, fontWeight: 500, fontSize: 20, letterSpacing: '0.25em', textTransform: 'uppercase' }}>DB Schema Designer</span>
                </div>

                {/* SVG FK lines — above cards so lines are never hidden by table cards */}
                <svg className="absolute inset-0 pointer-events-none" width={CANVAS_W} height={CANVAS_H} style={{ zIndex: 20 }}>
                  {renderLines()}
                </svg>

                {/* Empty state */}
                {tables.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none" style={{ zIndex: 5 }}>
                    <div style={{ width: 64, height: 64, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(99,102,241,0.4)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                      </svg>
                    </div>
                    <p className="text-sm" style={{ color: t.mutedText }}>Write SQL and click <strong style={{ color: '#6366f1' }}>Parse &amp; Render</strong></p>
                  </div>
                )}

                {/* Table cards */}
                {(() => {
                  // Compute connected tables for highlight mode
                  const connectedTables = new Set<string>();
                  if (selectedTable) {
                    connectedTables.add(selectedTable);
                    relationships.forEach(r => {
                      if (r.fromTable === selectedTable) connectedTables.add(r.toTable);
                      if (r.toTable === selectedTable) connectedTables.add(r.fromTable);
                    });
                  }
                  const hasSelection = selectedTable !== null;

                  return tables.map((tbl, idx) => {
                    const pos = positions[tbl.name] ?? { x: 60, y: 60 };
                    const color = tableColorMap[tbl.name] ?? TABLE_COLORS[idx % TABLE_COLORS.length];
                    const lightColor = TABLE_COLORS_LIGHT[idx % TABLE_COLORS_LIGHT.length];
                    const headerColor = isDark ? color : lightColor;
                    const isSelected = tbl.name === selectedTable;
                    const isConnected = connectedTables.has(tbl.name);
                    const isDimmed = hasSelection && !isConnected;

                    return (
                      <div key={tbl.name}
                        onClick={e => { e.stopPropagation(); setSelectedTable(prev => prev === tbl.name ? null : tbl.name); }}
                        style={{
                          position: 'absolute', left: pos.x, top: pos.y, width: TABLE_WIDTH,
                          height: tableHeight(tbl), zIndex: isSelected ? 15 : 10,
                          border: isSelected
                            ? `2px solid ${headerColor}`
                            : isConnected
                              ? `1.5px solid ${headerColor}88`
                              : `1px solid ${t.cardBorder}`,
                          borderRadius: 12, overflow: 'hidden',
                          boxShadow: isSelected
                            ? `0 0 0 3px ${headerColor}33, 0 8px 32px rgba(0,0,0,0.18)`
                            : isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.10)',
                          opacity: isDimmed ? 0.28 : 1,
                          transition: 'opacity 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
                          cursor: 'pointer',
                        }}>

                        {/* Header */}
                        <div className="flex items-center justify-between px-3 cursor-move select-none"
                          style={{ height: HEADER_HEIGHT, background: headerColor, boxShadow: `0 3px 12px ${headerColor}44` }}
                          onMouseDown={e => handleTableMouseDown(e, tbl.name)}>
                          <div className="flex items-center gap-2 min-w-0">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'rgba(255,255,255,0.65)' }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <span className="font-bold text-sm truncate" style={{ color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>{tbl.name}</span>
                          </div>
                          <span className="text-[11px] font-semibold shrink-0 ml-2 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.20)', color: 'rgba(255,255,255,0.85)' }}>
                            {tbl.columns.length}
                          </span>
                        </div>

                        {/* Columns */}
                        <div style={{ background: t.cardBg, borderLeft: `2px solid ${headerColor}${isDark ? '55' : 'cc'}` }}>
                          {tbl.columns.map((col, ci) => (
                            <div key={col.name}
                              className="flex items-center justify-between px-3 gap-2"
                              style={{ height: ROW_HEIGHT, borderBottom: `1px solid ${t.cardDivider}`, background: ci % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.015)') : 'transparent' }}>
                              <div className="flex items-center gap-1.5 min-w-0">
                                {col.isPrimary && <span className="text-[10px] font-bold shrink-0 w-5" style={{ color: t.pkText }}>PK</span>}
                                {!col.isPrimary && col.references && <span className="text-[10px] font-bold shrink-0 w-5" style={{ color: t.fkText }}>FK</span>}
                                {!col.isPrimary && !col.references && <span className="w-5 shrink-0" />}
                                <span className="text-xs truncate"
                                  style={{ color: col.isPrimary ? t.pkText : col.references ? t.fkText : t.colName, fontWeight: col.isPrimary ? 600 : 400 }}>
                                  {col.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[10px]" style={{ color: t.colType }}>{col.type}</span>
                                {!col.isNullable && <span className="text-[10px] font-bold text-red-500">*</span>}
                                {col.isUnique && <span className="text-[10px] font-bold" style={{ color: isDark ? '#c084fc' : '#7c3aed' }}>U</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FK strip (collapsible) ════════════════════════════════════════════ */}
      {relationships.length > 0 && (
        <div className="shrink-0" style={{ borderTop: `1px solid ${t.toolbarBorder}`, background: t.subHeaderBg }}>
          {/* Toggle header — click anywhere to expand/collapse */}
          <div className="flex items-center gap-2 px-3 cursor-pointer select-none"
            style={{ height: 28 }}
            onClick={() => setFkExpanded(v => !v)}>
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: t.labelColor }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: t.labelColor }}>
              FK Relationships
            </span>
            <span className="text-[10px] font-semibold rounded-full px-1.5 py-0.5"
              style={{ background: 'rgba(99,102,241,0.10)', color: isDark ? '#a5b4fc' : '#4338ca', border: '1px solid rgba(99,102,241,0.15)' }}>
              {relationships.length}
            </span>
            <span className="ml-auto text-[11px] font-bold font-mono" style={{ color: t.labelColor, userSelect: 'none' }}>
              {fkExpanded ? '−' : '+'}
            </span>
          </div>

          {/* Expanded content */}
          {fkExpanded && (
            <div className="flex flex-wrap gap-1.5 px-3 pb-2.5">
              {relationships.map((r, i) => (
                <span key={i} className="text-[11px] rounded-md px-2 py-0.5"
                  style={{ background: t.badgeBg, border: `1px solid ${t.badgeBorder}`, color: t.badgeText }}>
                  <span style={{ color: tableColorMap[r.fromTable] ?? '#6366f1', fontWeight: 600 }}>{r.fromTable}</span>
                  <span style={{ color: t.faintText }}>.{r.fromColumn}</span>
                  <span style={{ color: t.faintText, margin: '0 4px' }}>→</span>
                  <span style={{ color: tableColorMap[r.toTable] ?? '#6366f1', fontWeight: 600 }}>{r.toTable}</span>
                  <span style={{ color: t.faintText }}>.{r.toColumn}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ Save Modal ════════════════════════════════════════════════════════ */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSaveModal(false)} />
          <div className="relative rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4"
            style={{ background: t.modalBg, border: `1px solid ${t.modalBorder}` }}>
            <h2 className="text-base font-bold mb-4" style={{ color: isDark ? '#fff' : '#1e1b4b' }}>
              {currentDesignId ? 'Update Design' : 'Save Design'}
            </h2>
            <div className="space-y-3">
              {['Design Name *', 'Description'].map((label, li) => (
                <div key={label}>
                  <label className="text-[11px] font-semibold uppercase tracking-widest mb-1.5 block" style={{ color: t.mutedText }}>{label}</label>
                  <input autoFocus={li === 0}
                    className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
                    style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.inputText }}
                    placeholder={li === 0 ? 'e.g. E-commerce Schema' : 'Optional...'}
                    value={li === 0 ? designName : designDesc}
                    onChange={e => li === 0 ? setDesignName(e.target.value) : setDesignDesc(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && li === 0 && handleSave()}
                    onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.5)')}
                    onBlur={e => (e.target.style.borderColor = t.inputBorder)} />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={handleSave}
                className="flex-1 py-2 text-sm font-semibold rounded-lg text-white transition-all"
                style={{ background: '#6366f1' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#4f46e5')}
                onMouseLeave={e => (e.currentTarget.style.background = '#6366f1')}>
                {currentDesignId ? 'Update' : 'Save'}
              </button>
              <button onClick={() => setShowSaveModal(false)}
                className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
                style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}`, color: t.mutedText }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ My Designs Panel ══════════════════════════════════════════════════ */}
      {showDesignsPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDesignsPanel(false)} />
          <div className="relative rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[70vh] flex flex-col"
            style={{ background: t.modalBg, border: `1px solid ${t.modalBorder}` }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${t.toolbarBorder}` }}>
              <h2 className="text-base font-bold" style={{ color: isDark ? '#fff' : '#1e1b4b' }}>My Designs</h2>
              <button onClick={() => setShowDesignsPanel(false)} className="text-lg leading-none" style={{ color: t.mutedText }}>✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {loadingDesigns && <div className="text-center py-8 text-sm" style={{ color: t.mutedText }}>Loading...</div>}
              {!loadingDesigns && designs.length === 0 && <div className="text-center py-8 text-sm" style={{ color: t.mutedText }}>No saved designs yet.</div>}
              {designs.map(d => (
                <div key={d._id}
                  className="flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all"
                  style={{ background: t.inputBg, border: `1px solid ${t.inputBorder}` }}
                  onClick={() => loadDesign(d)}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.40)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = t.inputBorder)}>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: isDark ? 'rgba(255,255,255,0.85)' : '#1e1b4b' }}>{d.name}</p>
                    {d.description && <p className="text-xs truncate mt-0.5" style={{ color: t.mutedText }}>{d.description}</p>}
                    <p className="text-[10px] mt-1" style={{ color: t.faintText }}>{new Date(d.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(`${window.location.origin}/db-design?s=${encodeSQL(d.sql)}`); toast.success('Share link copied!'); }}
                      className="text-xs" style={{ color: '#0284c7' }}>Share</button>
                    <button onClick={e => { e.stopPropagation(); deleteDesign(d._id); }}
                      className="text-xs text-red-500">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
