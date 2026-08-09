import React, { useState, useMemo } from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import {
  Flame,
  Layers,
  Wind,
  Disc,
  Code,
  Copy,
  Check,
  Zap,
  Info,
  ShieldAlert,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  PanelLeftClose,
  PanelLeftOpen,
  FolderOpen,
  Activity,
  Maximize2,
  BarChart3,
  Sliders,
  Sparkles,
  Menu,
  X,
  BookOpen,
  Play,
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

// =============================================================================
// STREAMLIT PYTHON CODE SOURCE (FOR CODE VIEWER TAB)
// =============================================================================
const STREAMLIT_CODE = `"""
===============================================================================
APPLICATION: Heat Transport Analyser
MODULE: app.py
DESCRIPTION: A production-ready Streamlit application engineered for heat transfer 
             analysis including multi-layer composite resistance networks, 
             extended surfaces (fins), and critical radius of insulation.
THEME: Light Engineering Theme (Custom injected CSS, Open Sans typography)
AUTHOR: Senior Thermal & UI/UX Systems Engineer
===============================================================================
"""

import math
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import streamlit as st

# PAGE CONFIGURATION
st.set_page_config(
    page_title="Heat Transport Analyser",
    page_icon="🔥",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Aurora Dark Theme CSS Overrides
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Global Inter Font and Matte Black Background */
html, body, [class*="css"], .stApp {
    font-family: 'Inter', sans-serif !important;
    background-color: #000000 !important;
    color: #ffffff !important;
}

/* Sidebar Styling */
section[data-testid="stSidebar"] {
    background-color: #090d16 !important;
    border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
}

section[data-testid="stSidebar"] * {
    color: #ffffff !important;
}

/* Card Containers & Dark Form Panels */
div[data-testid="stVerticalBlock"] > div {
    background-color: #0d111c !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 16px !important;
    padding: 12px !important;
}

/* Input Fields (#1A1A1A Background) */
.stNumberInput input, .stSelectbox div[data-baseweb="select"], .stTextInput input {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
    border: 1px solid rgba(255, 255, 255, 0.15) !important;
    border-radius: 12px !important;
}

/* High Contrast White Action Buttons */
.stButton > button {
    background-color: #ffffff !important;
    color: #000000 !important;
    font-weight: 600 !important;
    border-radius: 12px !important;
    height: 48px !important;
    width: 100% !important;
    border: none !important;
    transition: all 0.2s ease !important;
}

.stButton > button:hover {
    background-color: rgba(255, 255, 255, 0.85) !important;
    transform: scale(0.99);
}

/* Clean Header Typography */
h1, h2, h3, h4, h5, h6 {
    color: #ffffff !important;
    font-weight: 600 !important;
    letter-spacing: -0.5px !important;
}
</style>
""", unsafe_allow_html=True)

# TOP HERO BANNER & QUICK START USER GUIDE
st.markdown("""
<div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%); padding: 36px; border-radius: 20px; color: white; margin-bottom: 24px;">
    <span style="background-color: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Thermal Engineering Platform</span>
    <h1 style="font-size: 2.2rem; font-weight: 700; margin: 12px 0 8px 0; color: white;">Heat Transport Analyser</h1>
    <p style="color: rgba(255,255,255,0.8); font-size: 0.95rem; line-height: 1.5; max-width: 700px;">
        Welcome! This software suite enables engineers and students to model, simulate, and analyze 1D steady-state heat conduction and convection across composite resistance networks, extended fin surfaces, and critical insulation geometries.
    </p>
</div>
""", unsafe_allow_html=True)

with st.expander("📖 Quick Start User Guide", expanded=False):
    st.markdown("""
    **How to Use the Heat Transport Analyser:**
    1. **Select Module**: Choose between **Multi-Layer Resistance Networks**, **Extended Surfaces / Fins**, and **Critical Radius of Insulation** in the left sidebar.
    2. **Input Parameters**: Configure layer conductivities ($k$), thicknesses ($L$), radii ($r$), and fluid convection coefficients ($h$).
    3. **Analyze Results**: View calculated thermal resistances, heat transfer rates ($Q$), temperature distribution plots, and LaTeX data tables.
    """)

# [See full script implementation in app.py]
`;

export default function App() {
  const [activeModule, setActiveModule] = useState<'module1' | 'module2' | 'module3'>('module1');
  const [viewMode, setViewMode] = useState<'instructions' | 'simulator' | 'code'>('instructions');
  const [copied, setCopied] = useState(false);
  const [isModuleSelectorOpen, setIsModuleSelectorOpen] = useState<boolean>(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // =========================================================================
  // MODULE 1 STATE (Multi-Layer Resistance Networks)
  // =========================================================================
  const [geometry, setGeometry] = useState<'wall' | 'cylinder' | 'sphere'>('wall');
  const [wallArea, setWallArea] = useState<number>(1.0);
  const [length, setLength] = useState<number>(1.0);

  const [hasInnerConv, setHasInnerConv] = useState<boolean>(true);
  const [hi, setHi] = useState<number>(50);
  const [TinfI, setTinfI] = useState<number>(120);

  const [hasOuterConv, setHasOuterConv] = useState<boolean>(true);
  const [ho, setHo] = useState<number>(15);
  const [TinfO, setTinfO] = useState<number>(20);

  const [layerCount, setLayerCount] = useState<number>(2);
  const [layers, setLayers] = useState([
    { thickness: 0.05, k: 15.0, rOut: 0.07 },
    { thickness: 0.08, k: 0.15, rOut: 0.15 },
    { thickness: 0.10, k: 0.05, rOut: 0.25 },
  ]);
  const [rIn, setRIn] = useState<number>(0.05);

  // =========================================================================
  // MODULE 2 STATE (Fins Analysis)
  // =========================================================================
  const [finShape, setFinShape] = useState<'rectangular' | 'pin'>('rectangular');
  const [Tb, setTb] = useState<number>(150);
  const [TinfFin, setTinfFin] = useState<number>(25);
  const [kFin, setKFin] = useState<number>(200);
  const [hFin, setHFin] = useState<number>(35);
  const [finLength, setFinLength] = useState<number>(0.15);
  const [finWidth, setFinWidth] = useState<number>(0.05);
  const [finThickness, setFinThickness] = useState<number>(0.003);
  const [finDiameter, setFinDiameter] = useState<number>(0.008);

  // =========================================================================
  // MODULE 3 STATE (Critical Radius)
  // =========================================================================
  const [crGeometry, setCrGeometry] = useState<'cylinder' | 'sphere'>('cylinder');
  const [rInnerCR, setRInnerCR] = useState<number>(0.01);
  const [kIns, setKIns] = useState<number>(0.05);
  const [hOutCR, setHOutCR] = useState<number>(5.0);
  const [pipeLen, setPipeLen] = useState<number>(1.0);
  const [TSurfaceCR, setTSurfaceCR] = useState<number>(90);
  const [TAmbientCR, setTAmbientCR] = useState<number>(20);

  // =========================================================================
  // MODULE 1 CALCULATIONS
  // =========================================================================
  const m1Calculations = useMemo(() => {
    let R_total = 0;
    const resistances: { name: string; R: number; formula: string; latex: string }[] = [];
    const nodes: { label: string; pos: number }[] = [];

    if (geometry === 'wall') {
      const A = wallArea;
      let currX = 0;
      nodes.push({ label: hasInnerConv ? 'T_∞,i' : 'T_s1', pos: currX });

      if (hasInnerConv) {
        const R_i = 1 / (hi * A);
        resistances.push({ name: 'Inner Convection', R: R_i, formula: '1 / (h_i · A)', latex: 'R_{\\text{conv,i}} = \\frac{1}{h_i A}' });
        currX += 0.01;
        nodes.push({ label: 'T_s1', pos: currX });
      }

      for (let i = 0; i < layerCount; i++) {
        const layer = layers[i];
        const R_cond = layer.thickness / (layer.k * A);
        resistances.push({
          name: `Layer ${i + 1} (k=${layer.k})`,
          R: R_cond,
          formula: 'L / (k · A)',
          latex: `R_{\\text{cond,${i+1}}} = \\frac{L_{${i+1}}}{k_{${i+1}} A}`
        });
        currX += layer.thickness;
        nodes.push({ label: `T_s${i + 2}`, pos: currX });
      }

      if (hasOuterConv) {
        const R_o = 1 / (ho * A);
        resistances.push({ name: 'Outer Convection', R: R_o, formula: '1 / (h_o · A)', latex: 'R_{\\text{conv,o}} = \\frac{1}{h_o A}' });
        currX += 0.01;
        nodes.push({ label: 'T_∞,o', pos: currX });
      }
    } else if (geometry === 'cylinder') {
      const L = length;
      let currR = rIn;
      nodes.push({ label: hasInnerConv ? 'T_∞,i' : 'T_s1', pos: hasInnerConv ? currR * 0.8 : currR });

      if (hasInnerConv) {
        const Ain = 2 * Math.PI * currR * L;
        const R_i = 1 / (hi * Ain);
        resistances.push({ name: 'Inner Convection', R: R_i, formula: '1 / (h_i · 2πr₁L)', latex: 'R_{\\text{conv,i}} = \\frac{1}{2\\pi r_1 L h_i}' });
        nodes.push({ label: 'T_s1', pos: currR });
      }

      for (let i = 0; i < layerCount; i++) {
        const layer = layers[i];
        const rOutLayer = layer.rOut > currR ? layer.rOut : currR + 0.02;
        const R_cond = Math.log(rOutLayer / currR) / (2 * Math.PI * layer.k * L);
        resistances.push({
          name: `Layer ${i + 1} (k=${layer.k})`,
          R: R_cond,
          formula: 'ln(r₂/r₁) / (2πkL)',
          latex: `R_{\\text{cond,${i+1}}} = \\frac{\\ln(r_{${i+2}}/r_{${i+1}})}{2\\pi k_{${i+1}} L}`
        });
        currR = rOutLayer;
        nodes.push({ label: `T_s${i + 2}`, pos: currR });
      }

      if (hasOuterConv) {
        const Aout = 2 * Math.PI * currR * L;
        const R_o = 1 / (ho * Aout);
        resistances.push({ name: 'Outer Convection', R: R_o, formula: '1 / (h_o · 2πr_out L)', latex: 'R_{\\text{conv,o}} = \\frac{1}{2\\pi r_{\\text{out}} L h_o}' });
        nodes.push({ label: 'T_∞,o', pos: currR * 1.1 });
      }
    } else {
      let currR = rIn;
      nodes.push({ label: hasInnerConv ? 'T_∞,i' : 'T_s1', pos: hasInnerConv ? currR * 0.8 : currR });

      if (hasInnerConv) {
        const Ain = 4 * Math.PI * currR * currR;
        const R_i = 1 / (hi * Ain);
        resistances.push({ name: 'Inner Convection', R: R_i, formula: '1 / (h_i · 4πr₁²)', latex: 'R_{\\text{conv,i}} = \\frac{1}{4\\pi r_1^2 h_i}' });
        nodes.push({ label: 'T_s1', pos: currR });
      }

      for (let i = 0; i < layerCount; i++) {
        const layer = layers[i];
        const rOutLayer = layer.rOut > currR ? layer.rOut : currR + 0.02;
        const R_cond = (rOutLayer - currR) / (4 * Math.PI * layer.k * currR * rOutLayer);
        resistances.push({
          name: `Layer ${i + 1} (k=${layer.k})`,
          R: R_cond,
          formula: '(r₂-r₁) / (4πk r₁ r₂)',
          latex: `R_{\\text{cond,${i+1}}} = \\frac{r_{${i+2}}-r_{${i+1}}}{4\\pi k_{${i+1}} r_{${i+1}} r_{${i+2}}}`
        });
        currR = rOutLayer;
        nodes.push({ label: `T_s${i + 2}`, pos: currR });
      }

      if (hasOuterConv) {
        const Aout = 4 * Math.PI * currR * currR;
        const R_o = 1 / (ho * Aout);
        resistances.push({ name: 'Outer Convection', R: R_o, formula: '1 / (h_o · 4πr_out²)', latex: 'R_{\\text{conv,o}} = \\frac{1}{4\\pi r_{\\text{out}}^2 h_o}' });
        nodes.push({ label: 'T_∞,o', pos: currR * 1.1 });
      }
    }

    R_total = resistances.reduce((acc, curr) => acc + curr.R, 0);
    const DeltaT = TinfI - TinfO;
    const Q = R_total > 0 ? DeltaT / R_total : 0;

    let currT = TinfI;
    const tempProfile = [currT];
    resistances.forEach((res) => {
      currT -= Q * res.R;
      tempProfile.push(currT);
    });

    const chartData = nodes.map((node, idx) => ({
      pos: parseFloat(node.pos.toFixed(4)),
      temp: parseFloat(tempProfile[idx]?.toFixed(2) || '0'),
      node: node.label
    }));

    return { R_total, DeltaT, Q, resistances, chartData };
  }, [geometry, wallArea, length, hasInnerConv, hi, TinfI, hasOuterConv, ho, TinfO, layerCount, layers, rIn]);

  // =========================================================================
  // MODULE 2 CALCULATIONS
  // =========================================================================
  const m2Calculations = useMemo(() => {
    let P = 0;
    let Ac = 0;

    if (finShape === 'rectangular') {
      P = 2 * (finWidth + finThickness);
      Ac = finWidth * finThickness;
    } else {
      P = Math.PI * finDiameter;
      Ac = (Math.PI * finDiameter * finDiameter) / 4;
    }

    const m = Math.sqrt((hFin * P) / (kFin * Ac));
    const M = Math.sqrt(hFin * P * kFin * Ac) * (Tb - TinfFin);
    const Q_fin = M;
    const Q_max = hFin * (P * finLength) * (Tb - TinfFin);
    const efficiency = Q_max > 0 ? (Q_fin / Q_max) * 100 : 0;

    const Q_no_fin = hFin * Ac * (Tb - TinfFin);
    const effectiveness = Q_no_fin > 0 ? Q_fin / Q_no_fin : 0;

    const chartData = [];
    const steps = 50;
    for (let i = 0; i <= steps; i++) {
      const x = (finLength * i) / steps;
      const T_x = TinfFin + (Tb - TinfFin) * Math.exp(-m * x);
      chartData.push({
        x: parseFloat(x.toFixed(4)),
        temp: parseFloat(T_x.toFixed(2))
      });
    }

    return { m, Q_fin, efficiency, effectiveness, chartData };
  }, [finShape, Tb, TinfFin, kFin, hFin, finLength, finWidth, finThickness, finDiameter]);

  // =========================================================================
  // MODULE 3 CALCULATIONS
  // =========================================================================
  const m3Calculations = useMemo(() => {
    const r_cr = crGeometry === 'cylinder' ? kIns / hOutCR : (2 * kIns) / hOutCR;

    const rMax = Math.max(r_cr * 3, rInnerCR * 3);
    const steps = 100;
    const chartData = [];

    for (let i = 0; i <= steps; i++) {
      const r_o = rInnerCR + ((rMax - rInnerCR) * i) / steps;
      let R_cond = 0;
      let R_conv = 0;

      if (crGeometry === 'cylinder') {
        R_cond = Math.log(r_o / rInnerCR) / (2 * Math.PI * kIns * pipeLen);
        R_conv = 1 / (hOutCR * 2 * Math.PI * r_o * pipeLen);
      } else {
        R_cond = (r_o - rInnerCR) / (4 * Math.PI * kIns * rInnerCR * r_o);
        R_conv = 1 / (hOutCR * 4 * Math.PI * r_o * r_o);
      }

      const R_tot = R_cond + R_conv;
      const Q = (TSurfaceCR - TAmbientCR) / R_tot;

      chartData.push({
        radiusMm: parseFloat((r_o * 1000).toFixed(2)),
        Q: parseFloat(Q.toFixed(2))
      });
    }

    return { r_cr, chartData };
  }, [crGeometry, rInnerCR, kIns, hOutCR, pipeLen, TSurfaceCR, TAmbientCR]);

  const copyCode = () => {
    navigator.clipboard.writeText(STREAMLIT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* HEADER BAR */}
      <header className="border-b border-slate-200 bg-white px-4 md:px-6 py-3.5 flex flex-wrap xl:flex-nowrap items-center justify-between gap-4 sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-600 hover:bg-slate-200 transition-all flex items-center justify-center cursor-pointer shrink-0"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-blue-600" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-slate-600" />
            )}
          </button>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
              Heat Transport Analyser
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">
              Interactive 1D Steady-State Thermal Engineering Engine
            </p>
          </div>
        </div>

        {/* TOP CONTROLS & SWITCHER */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* VIEW SWITCHER */}
          <div className="bg-slate-100 border border-slate-200 p-1 rounded-xl flex items-center gap-1 shrink-0">
            <button
              onClick={() => setViewMode('instructions')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'instructions'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>User Instructions</span>
            </button>
            <button
              onClick={() => setViewMode('simulator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'simulator'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>Interactive Workspace</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                viewMode === 'code'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-4 h-4 shrink-0" />
              <span>Python Streamlit Code</span>
            </button>
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      {viewMode === 'instructions' ? (
        <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* WELCOME HERO BANNER */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-2xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-300" /> Thermal Engineering Platform
              </div>
              
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Heat Transport Analyser
              </h2>
              
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Welcome! This software suite enables engineers and students to model, simulate, and analyze 1D steady-state heat conduction and convection across composite resistance networks, extended fin surfaces, and critical insulation geometries.
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setViewMode('simulator')}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Using Simulator</span>
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold text-sm transition-all border border-white/15 cursor-pointer"
                >
                  <Code className="w-4 h-4" />
                  <span>Python Source Code</span>
                </button>
              </div>
            </div>
          </div>

          {/* QUICK START INSTRUCTIONS CARDS */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Quick Start User Guide
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-blue-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-lg flex items-center justify-center">
                  1
                </div>
                <h4 className="font-bold text-slate-900 text-base">Select Analysis Module</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Choose between <strong>Multi-Layer Resistance Networks</strong>, <strong>Extended Surface Fins</strong>, or <strong>Critical Insulation Radius</strong> from the left navigation drawer.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-blue-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-lg flex items-center justify-center">
                  2
                </div>
                <h4 className="font-bold text-slate-900 text-base">Enter System Parameters</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Input geometries (Wall, Cylinder, Sphere), solid layer conductivities (<InlineMath math="k" />), thicknesses (<InlineMath math="L" />), and fluid convection coefficients (<InlineMath math="h" />).
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs hover:border-blue-300 transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-lg flex items-center justify-center">
                  3
                </div>
                <h4 className="font-bold text-slate-900 text-base">Analyze Results & Charts</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instantly view total thermal resistance (<InlineMath math="R_{\text{total}}" />), heat transport (<InlineMath math="Q" />), temperature decay curves, and breakdown LaTeX tables.
                </p>
              </div>
            </div>
          </div>

          {/* DETAILED MODULE FEATURES OVERVIEW */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Available Engineering Modules & Physics Models
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {/* MODULE 1 */}
              <div className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-3 bg-blue-100 text-blue-700 rounded-xl shrink-0 mt-0.5">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-base">Module 1: Multi-Layer Thermal Resistance Networks</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Models 1D steady-state heat conduction across multi-layer Cartesian walls, hollow cylindrical pipes, and concentric spherical vessels. Incorporates inner and outer fluid boundary convection coefficients (<InlineMath math="h_i, h_o" />) to compute total system thermal resistance (<InlineMath math="R_{\text{total}}" />) and internal interface temperatures (<InlineMath math="T_1, T_2, \dots" />).
                  </p>
                </div>
              </div>

              {/* MODULE 2 */}
              <div className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-3 bg-rose-100 text-rose-700 rounded-xl shrink-0 mt-0.5">
                  <Wind className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-base">Module 2: Extended Surfaces / Fins</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Evaluates coupled conduction-convection heat dissipation from extended surfaces (rectangular fins or pin/circular fins). Calculates the fin parameter <InlineMath math="m = \sqrt{hP/kA_c}" />, total dissipated heat flux <InlineMath math="Q_{\text{fin}}" />, and fin effectiveness (<InlineMath math="\epsilon_{\text{fin}}" />), alongside spatial exponential temperature distribution plots.
                  </p>
                </div>
              </div>

              {/* MODULE 3 */}
              <div className="flex gap-4 items-start p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
                  <Disc className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-base">Module 3: Critical Insulation Radius Analyser</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Determines the critical radius <InlineMath math="r_{\text{cr}} = k/h" /> (for cylinders) or <InlineMath math="r_{\text{cr}} = 2k/h" /> (for spheres) where total thermal resistance reaches its minimum value. Helps engineers prevent adding insulation that accidentally increases heat dissipation from electrical cables or small piping!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* LAUNCH CTA FOOTER */}
          <div className="bg-slate-100 border border-slate-200 rounded-2xl p-6 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-bold text-slate-900 text-base">Ready to start simulating?</h4>
              <p className="text-xs text-slate-600 mt-0.5">Click the button to open the interactive thermal calculation engine.</p>
            </div>
            <button
              onClick={() => setViewMode('simulator')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shrink-0 shadow-xs"
            >
              <span>Launch Interactive Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : viewMode === 'code' ? (
        <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-md overflow-hidden">
            <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <Code className="w-4 h-4 text-blue-400" />
                <span>app.py — Production Thermal Analysis Server Source</span>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-500 transition-all rounded-lg text-sm font-bold cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Script!' : 'Copy Source Code'}</span>
              </button>
            </div>
            <pre className="p-6 text-sm font-mono text-slate-50 bg-slate-950 overflow-x-auto max-h-[70vh] leading-relaxed select-text">
              {STREAMLIT_CODE}
            </pre>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          {/* SIDEBAR NAVIGATION PANEL */}
          <aside
            className={`bg-white border-r border-slate-200 flex flex-col gap-6 shrink-0 transition-all duration-300 z-20 ${
              isSidebarCollapsed ? 'w-0 opacity-0 overflow-hidden p-0 border-none' : 'w-full md:w-88 p-5'
            }`}
          >
            {/* EXPANDED SIDEBAR CONTENT */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all">
              {/* ACCORDION HEADER */}
              <button
                onClick={() => setIsModuleSelectorOpen(!isModuleSelectorOpen)}
                className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-100 transition-all text-left cursor-pointer border-b border-slate-200"
              >
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4.5 h-4.5 text-blue-600" />
                  <span className="text-xs md:text-sm font-extrabold text-slate-800 tracking-wider uppercase">
                    ANALYSIS MODULES
                  </span>
                </div>
                {isModuleSelectorOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </button>

              {/* MODULE SELECTION CONTENT */}
              {isModuleSelectorOpen && (
                <div className="p-3 flex flex-col gap-2.5">
                  <button
                    onClick={() => setActiveModule('module1')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all text-sm font-semibold cursor-pointer ${
                      activeModule === 'module1'
                        ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Layers className="w-4.5 h-4.5 text-blue-600" />
                      <span>Module 1: Resistance Networks</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setActiveModule('module2')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all text-sm font-semibold cursor-pointer ${
                      activeModule === 'module2'
                        ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Wind className="w-4.5 h-4.5 text-rose-600" />
                      <span>Module 2: Extended Surfaces / Fins</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => setActiveModule('module3')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all text-sm font-semibold cursor-pointer ${
                      activeModule === 'module3'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Disc className="w-4.5 h-4.5 text-emerald-600" />
                      <span>Module 3: Critical Insulation Radius</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              )}
            </div>

            {/* FORMULA QUICK CARD WITH PROPER LATEX RENDERING */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-sm text-slate-700 space-y-3.5 shadow-xs mt-auto">
              <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2.5 text-sm">
                <Sparkles className="w-4 h-4 text-amber-500" /> Key Physics Relations
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Plane Wall Resistance:</span>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center text-sm">
                    <InlineMath math="R_{\text{cond}} = \frac{L}{k \cdot A}" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Cylinder Radial Resistance:</span>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center text-sm">
                    <InlineMath math="R_{\text{cond}} = \frac{\ln(r_2/r_1)}{2\pi k L}" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Convective Resistance:</span>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center text-sm">
                    <InlineMath math="R_{\text{conv}} = \frac{1}{h \cdot A}" />
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-500 block mb-1">Critical Radius (Cylinder):</span>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-center text-sm">
                    <InlineMath math="r_{\text{cr}} = \frac{k}{h}" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT WORKSPACE */}
          <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full transition-all">
            {/* FLOATING SIDEBAR TOGGLE WHEN COLLAPSED */}
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="mb-4 flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 shadow-sm rounded-xl text-xs font-bold text-blue-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <PanelLeftOpen className="w-4 h-4 text-blue-600" />
                <span>Show Navigation Panel</span>
              </button>
            )}

            {/* MODULE 1: MULTI-LAYER RESISTANCE NETWORKS */}
            {activeModule === 'module1' && (
              <div className="space-y-6">
                {/* HERO BANNER */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                        Phase 1: Setup
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                        Phase 2: Solve
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                      Composite Thermal Resistance Networks
                    </h2>
                    <p className="text-sm md:text-base text-slate-600 mt-1.5 max-w-xl">
                      Analyse heat flux and interface temperature profiles across multi-layer Cartesian walls, hollow cylinders, and concentric spheres.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center min-w-[200px]">
                    <span className="text-3xl">🧱</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">1D Diffusion</h4>
                    <p className="text-xs text-slate-500 font-medium">Steady State • No Generation</p>
                  </div>
                </div>

                {/* CONTROLS AND ANALYTICS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* INPUT CONTROLS (5 COLS) */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Sliders className="w-5 h-5 text-blue-600" /> 1. System Geometry & Boundaries
                    </h3>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Geometry Type</label>
                      <select
                        value={geometry}
                        onChange={(e) => setGeometry(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                      >
                        <option value="wall">Plane Wall (Cartesian)</option>
                        <option value="cylinder">Hollow Cylinder (Radial)</option>
                        <option value="sphere">Hollow Sphere (Spherical)</option>
                      </select>
                    </div>

                    {geometry === 'wall' ? (
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Wall Area A (m²)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.01"
                          value={wallArea}
                          onChange={(e) => setWallArea(parseFloat(e.target.value) || 0.1)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Length L (m)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.01"
                          value={length}
                          onChange={(e) => setLength(parseFloat(e.target.value) || 0.1)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                        />
                      </div>
                    )}

                    {geometry !== 'wall' && (
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Inner Radius r₁ (m)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.001"
                          value={rIn}
                          onChange={(e) => setRIn(parseFloat(e.target.value) || 0.01)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 shadow-2xs"
                        />
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-2.5">2. Fluid Boundaries</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-600 block mb-1">Inner h_i (W/m²K)</label>
                          <input
                            type="number"
                            value={hi}
                            onChange={(e) => setHi(parseFloat(e.target.value) || 1)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 block mb-1">Inner T_∞,i (°C)</label>
                          <input
                            type="number"
                            value={TinfI}
                            onChange={(e) => setTinfI(parseFloat(e.target.value) || 0)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 block mb-1">Outer h_o (W/m²K)</label>
                          <input
                            type="number"
                            value={ho}
                            onChange={(e) => setHo(parseFloat(e.target.value) || 1)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-600 block mb-1">Outer T_∞,o (°C)</label>
                          <input
                            type="number"
                            value={TinfO}
                            onChange={(e) => setTinfO(parseFloat(e.target.value) || 0)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-2.5">3. Solid Layers</h4>
                      <div className="space-y-3">
                        {layers.slice(0, layerCount).map((layer, idx) => (
                          <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                            <span className="text-xs font-bold text-slate-800">Layer {idx + 1}</span>
                            <div className="grid grid-cols-2 gap-2.5">
                              <div>
                                <label className="text-xs text-slate-500 font-medium block mb-1">Thickness L (m)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={layer.thickness}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0.01;
                                    const next = [...layers];
                                    next[idx].thickness = val;
                                    setLayers(next);
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm text-slate-900"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-slate-500 font-medium block mb-1">Conductivity k (W/mK)</label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={layer.k}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value) || 0.1;
                                    const next = [...layers];
                                    next[idx].k = val;
                                    setLayers(next);
                                  }}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm text-slate-900"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* DISPLAY METRICS & GRAPH (7 COLS) */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <BarChart3 className="w-5 h-5 text-blue-600" /> Solution & Temperature Profile
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Total Resistance</span>
                        <span className="text-2xl font-bold text-slate-900">
                          {m1Calculations.R_total.toFixed(4)} <span className="text-xs font-normal text-slate-500">K/W</span>
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Heat Transport Q</span>
                        <span className="text-2xl font-bold text-blue-700">
                          {m1Calculations.Q.toFixed(2)} <span className="text-xs font-normal text-slate-500">W</span>
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Overall ΔT</span>
                        <span className="text-2xl font-bold text-slate-900">
                          {m1Calculations.DeltaT.toFixed(1)} <span className="text-xs font-normal text-slate-500">°C</span>
                        </span>
                      </div>
                    </div>

                    <div className="h-64 w-full bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={m1Calculations.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="pos" stroke="#64748b" fontSize={12} label={{ value: 'Position (m)', position: 'insideBottom', offset: -5 }} />
                          <YAxis stroke="#64748b" fontSize={12} label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '13px' }} />
                          <Line type="monotone" dataKey="temp" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2.5">Resistance Breakdown Table</h4>
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                            <tr>
                              <th className="p-3">Element</th>
                              <th className="p-3">R (K/W)</th>
                              <th className="p-3">LaTeX Equation</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {m1Calculations.resistances.map((res, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-3 font-semibold text-slate-800">{res.name}</td>
                                <td className="p-3 font-mono text-blue-700 font-bold">{res.R.toFixed(5)}</td>
                                <td className="p-3">
                                  <InlineMath math={res.latex} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: EXTENDED SURFACES / FINS */}
            {activeModule === 'module2' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                        Infinitely Long Fin
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                        Steady State
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Extended Surface Thermal Dissipation</h2>
                    <p className="text-sm md:text-base text-slate-600 mt-1.5 max-w-xl">
                      Calculate conduction-convection coupled heat loss and spatial exponential temperature decay along fins.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center min-w-[200px]">
                    <span className="text-3xl">⚡</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">1D Analytical Fin</h4>
                    <p className="text-xs text-slate-500 font-medium">Exponential Temp Decay</p>
                  </div>
                </div>

                {/* FORMULA BANNER WITH LATEX */}
                <div className="bg-slate-100 border border-slate-200 p-5 rounded-2xl text-center space-y-3">
                  <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">Governing Analytical Equations</span>
                  <div className="flex flex-wrap justify-center items-center gap-8 text-base font-semibold">
                    <BlockMath math="T(x) = T_\infty + (T_b - T_\infty) e^{-m x}" />
                    <BlockMath math="m = \sqrt{\frac{h P}{k A_c}}" />
                    <BlockMath math="Q_{\text{fin}} = \sqrt{h P k A_c} (T_b - T_\infty)" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* CONTROLS */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Sliders className="w-5 h-5 text-rose-600" /> Fin Parameters
                    </h3>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Fin Cross-Section</label>
                      <select
                        value={finShape}
                        onChange={(e) => setFinShape(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs"
                      >
                        <option value="rectangular">Rectangular Fin</option>
                        <option value="pin">Pin Fin (Circular)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Base Temp T_b (°C)</label>
                        <input
                          type="number"
                          value={Tb}
                          onChange={(e) => setTb(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Ambient Temp T_∞ (°C)</label>
                        <input
                          type="number"
                          value={TinfFin}
                          onChange={(e) => setTinfFin(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Conductivity k (W/mK)</label>
                        <input
                          type="number"
                          value={kFin}
                          onChange={(e) => setKFin(parseFloat(e.target.value) || 1)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Conv. Coeff h (W/m²K)</label>
                        <input
                          type="number"
                          value={hFin}
                          onChange={(e) => setHFin(parseFloat(e.target.value) || 1)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-3">
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Fin Length L (m)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={finLength}
                          onChange={(e) => setFinLength(parseFloat(e.target.value) || 0.01)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs"
                        />
                      </div>

                      {finShape === 'rectangular' ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-600 block mb-1">Width w (m)</label>
                            <input
                              type="number"
                              step="0.005"
                              value={finWidth}
                              onChange={(e) => setFinWidth(parseFloat(e.target.value) || 0.001)}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-600 block mb-1">Thickness t (m)</label>
                            <input
                              type="number"
                              step="0.001"
                              value={finThickness}
                              onChange={(e) => setFinThickness(parseFloat(e.target.value) || 0.0005)}
                              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="text-sm font-semibold text-slate-700 block mb-1.5">Pin Diameter D (m)</label>
                          <input
                            type="number"
                            step="0.001"
                            value={finDiameter}
                            onChange={(e) => setFinDiameter(parseFloat(e.target.value) || 0.001)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DISPLAY */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <BarChart3 className="w-5 h-5 text-rose-600" /> Fin Performance & Spatial Temperature
                    </h3>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Fin Parameter m</span>
                        <span className="text-2xl font-bold text-slate-900">
                          {m2Calculations.m.toFixed(2)} <span className="text-xs font-normal text-slate-500">m⁻¹</span>
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Heat Dissipated Q_fin</span>
                        <span className="text-2xl font-bold text-rose-600">
                          {m2Calculations.Q_fin.toFixed(2)} <span className="text-xs font-normal text-slate-500">W</span>
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Effectiveness ε_fin</span>
                        <span className="text-2xl font-bold text-slate-900">
                          {m2Calculations.effectiveness.toFixed(2)} <span className="text-xs font-normal text-slate-500">x</span>
                        </span>
                      </div>
                    </div>

                    <div className="h-64 w-full bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={m2Calculations.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="x" stroke="#64748b" fontSize={12} label={{ value: 'Distance x (m)', position: 'insideBottom', offset: -5 }} />
                          <YAxis stroke="#64748b" fontSize={12} label={{ value: 'Temp (°C)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '13px' }} />
                          <ReferenceLine y={TinfFin} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: 'T_ambient', fill: '#64748b', fontSize: 11 }} />
                          <Line type="monotone" dataKey="temp" stroke="#e11d48" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 3: CRITICAL INSULATION RADIUS */}
            {activeModule === 'module3' && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Optimum Insulation
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                        r_cr Peak
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Critical Radius of Insulation Analyser</h2>
                    <p className="text-sm md:text-base text-slate-600 mt-1.5 max-w-xl">
                      Determine whether adding insulation increases or decreases total heat loss by locating the critical thermal resistance extremum.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center min-w-[200px]">
                    <span className="text-3xl">⭕</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">Thermal Trade-off</h4>
                    <p className="text-xs text-slate-500 font-medium">R_cond ↑ vs R_conv ↓</p>
                  </div>
                </div>

                {/* FORMULA BANNER WITH LATEX */}
                <div className="bg-slate-100 border border-slate-200 p-5 rounded-2xl text-center flex flex-wrap justify-center items-center gap-8">
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <span className="text-sm font-bold text-slate-700">Cylinder Critical Radius:</span>
                    <BlockMath math="r_{\text{cr, cyl}} = \frac{k}{h}" />
                  </div>
                  <div className="flex items-center gap-2 text-base font-semibold">
                    <span className="text-sm font-bold text-slate-700">Sphere Critical Radius:</span>
                    <BlockMath math="r_{\text{cr, sph}} = \frac{2k}{h}" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Sliders className="w-5 h-5 text-emerald-600" /> Structure & Materials
                    </h3>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Structure Geometry</label>
                      <select
                        value={crGeometry}
                        onChange={(e) => setCrGeometry(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs"
                      >
                        <option value="cylinder">Cylinder (Pipe / Cable)</option>
                        <option value="sphere">Sphere (Vessel / Tank)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 block mb-1.5">Inner Radius r_i (m)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={rInnerCR}
                        onChange={(e) => setRInnerCR(parseFloat(e.target.value) || 0.001)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Insulation k (W/mK)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={kIns}
                          onChange={(e) => setKIns(parseFloat(e.target.value) || 0.01)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Outer Conv h (W/m²K)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={hOutCR}
                          onChange={(e) => setHOutCR(parseFloat(e.target.value) || 0.5)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                        />
                      </div>
                    </div>

                    {crGeometry === 'cylinder' && (
                      <div>
                        <label className="text-sm font-semibold text-slate-700 block mb-1.5">Pipe Length L (m)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={pipeLen}
                          onChange={(e) => setPipeLen(parseFloat(e.target.value) || 0.1)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Surface T_i (°C)</label>
                        <input
                          type="number"
                          value={TSurfaceCR}
                          onChange={(e) => setTSurfaceCR(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Ambient T_∞ (°C)</label>
                        <input
                          type="number"
                          value={TAmbientCR}
                          onChange={(e) => setTAmbientCR(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 shadow-2xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                      <BarChart3 className="w-5 h-5 text-emerald-600" /> Critical Radius Peak Analytics
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Critical Radius r_cr</span>
                        <span className="text-2xl font-bold text-emerald-700">
                          {(m3Calculations.r_cr * 1000).toFixed(2)} <span className="text-xs font-normal text-slate-500">mm</span>
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Current Inner Radius r_i</span>
                        <span className="text-2xl font-bold text-slate-900">
                          {(rInnerCR * 1000).toFixed(2)} <span className="text-xs font-normal text-slate-500">mm</span>
                        </span>
                      </div>
                    </div>

                    {rInnerCR < m3Calculations.r_cr ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block mb-0.5 text-base">Heat Dissipation Increase Notice</span>
                          Since r_i ({(rInnerCR * 1000).toFixed(1)} mm) &lt; r_cr ({(m3Calculations.r_cr * 1000).toFixed(1)} mm), adding insulation up to r_cr will <strong>INCREASE</strong> total heat loss!
                        </div>
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900 flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block mb-0.5 text-base">Insulation Effective</span>
                          Since r_i ({(rInnerCR * 1000).toFixed(1)} mm) &gt; r_cr ({(m3Calculations.r_cr * 1000).toFixed(1)} mm), adding insulation will immediately <strong>DECREASE</strong> heat loss.
                        </div>
                      </div>
                    )}

                    <div className="h-64 w-full bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={m3Calculations.chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="radiusMm" stroke="#64748b" fontSize={12} label={{ value: 'Outer Radius r_o (mm)', position: 'insideBottom', offset: -5 }} />
                          <YAxis stroke="#64748b" fontSize={12} label={{ value: 'Heat Loss Q (W)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', fontSize: '13px' }} />
                          <ReferenceLine x={m3Calculations.r_cr * 1000} stroke="#d97706" strokeDasharray="3 3" label={{ value: `r_cr=${(m3Calculations.r_cr*1000).toFixed(1)}mm`, fill: '#d97706', fontSize: 11 }} />
                          <Line type="monotone" dataKey="Q" stroke="#059669" strokeWidth={3} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
