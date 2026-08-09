"""
==============================================================================
AI ASSISTED DEVELOPMENT DOCUMENTATION
==============================================================================
AI Tools Used: 
- Google AI Studio (Gemini)

Key Prompts Given:
1. "Build a multi-geometry thermal resistance network calculator with custom CSS styling."
2. "Integrate extended surface fin temperature profiles and critical insulation radius plots using Plotly."
3. "Apply a clean light engineering theme override with Tailwind base rules, Inter typography, and KaTeX scaling."

Manual Verification & Edits:
- Verified radial thermal resistance formulas for hollow cylinders and spheres.
- Checked Fourier's Law and Newton's Law of Cooling boundary conditions against course lecture slides.
- Combined CSS styling and Tailwind base rules directly inside app.py for Streamlit Cloud deployment compatibility.
==============================================================================
"""

import math
import os
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import streamlit as st

# =============================================================================
# PAGE CONFIGURATION
# =============================================================================
st.set_page_config(
    page_title="Heat Transport Analyser",
    page_icon="🔥",
    layout="wide",
    initial_sidebar_state="expanded",
)

# =============================================================================
# COMBINED INLINE STYLESHEET (Tailwind Base + Custom Theme + KaTeX Sizing)
# =============================================================================
st.markdown("""
<style>
/* =============================================================================
   TAILWIND BASE & GLOBAL RESETS
   ============================================================================= */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;600;700&display=swap');

html {
    font-size: 16px !important;
}

body, [class*="css"], .stApp {
    font-family: 'Open Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif !important;
    font-size: 1rem !important;
    line-height: 1.5 !important;
    background-color: #f8fafc !important;
    color: #1e293b !important;
}

.stAppViewContainer {
    background-color: #f8fafc !important;
}

/* Form Controls Global Typography */
input, select, textarea, button {
    font-family: 'Open Sans', sans-serif !important;
}

/* =============================================================================
   KATEX MATH FORMULA PROPORTIONAL SCALING
   ============================================================================= */
.katex {
    font-size: 1.1em !important;
    color: #0f172a !important;
}

.katex-display {
    margin: 0.6em 0 !important;
    padding: 10px !important;
    background-color: #f8fafc !important;
    border-radius: 10px !important;
    border: 1px solid #e2e8f0 !important;
}

/* =============================================================================
   STREAMLIT UI CLEANUP & CONTAINER PADDING
   ============================================================================= */
#MainMenu { visibility: hidden; }
footer { visibility: hidden; }
header[data-testid="stHeader"] { 
    background: transparent !important; 
    z-index: 100;
}

.main .block-container {
    padding-top: 2rem !important;
    padding-bottom: 3rem !important;
    max-width: 1400px !important;
}

/* =============================================================================
   SIDEBAR STYLING
   ============================================================================= */
section[data-testid="stSidebar"] {
    background-color: #ffffff !important;
    border-right: 1px solid #e2e8f0 !important;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.02) !important;
}

section[data-testid="stSidebar"] .block-container {
    padding-top: 1.5rem !important;
}

section[data-testid="stSidebar"] h1,
section[data-testid="stSidebar"] h2,
section[data-testid="stSidebar"] h3,
section[data-testid="stSidebar"] h4 {
    color: #0f172a !important;
    font-weight: 700 !important;
}

section[data-testid="stSidebar"] p,
section[data-testid="stSidebar"] label,
section[data-testid="stSidebar"] span {
    color: #334155 !important;
}

/* Sidebar Radio Selector Cards */
div[data-testid="stRadio"] > label {
    font-weight: 700 !important;
    color: #1e293b !important;
    font-size: 0.85rem !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
}

div[data-testid="stRadio"] div[role="radiogroup"] > label {
    background-color: #f1f5f9 !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 10px !important;
    padding: 10px 14px !important;
    margin-bottom: 8px !important;
    transition: all 0.2s ease !important;
    cursor: pointer !important;
}

div[data-testid="stRadio"] div[role="radiogroup"] > label:hover {
    background-color: #e2e8f0 !important;
    border-color: #cbd5e1 !important;
}

div[data-testid="stRadio"] div[role="radiogroup"] > label[data-checked="true"] {
    background-color: #eff6ff !important;
    border-color: #3b82f6 !important;
    color: #1d4ed8 !important;
    font-weight: 600 !important;
}

/* =============================================================================
   CUSTOM CARD & HERO CONTAINER CLASSES
   ============================================================================= */
.app-card {
    background: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 16px !important;
    padding: 24px !important;
    margin-bottom: 20px !important;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04) !important;
}

.app-hero {
    background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%) !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 16px !important;
    padding: 24px !important;
    margin-bottom: 20px !important;
    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.05) !important;
}

.phase-badge {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-right: 8px;
}

.phase-active {
    background-color: #dbeafe !important;
    color: #1d4ed8 !important;
    border: 1px solid #bfdbfe !important;
}

.phase-idle {
    background-color: #f1f5f9 !important;
    color: #64748b !important;
    border: 1px solid #e2e8f0 !important;
}

/* =============================================================================
   METRICS & CARDS OVERRIDES
   ============================================================================= */
div[data-testid="stMetric"] {
    background-color: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 14px !important;
    padding: 16px 20px !important;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04) !important;
    transition: transform 0.15s ease, box-shadow 0.15s ease !important;
}

div[data-testid="stMetric"]:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08) !important;
}

div[data-testid="stMetricLabel"] {
    color: #64748b !important;
    font-size: 0.85rem !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.025em !important;
}

div[data-testid="stMetricValue"] {
    color: #0f172a !important;
    font-weight: 800 !important;
    font-size: 1.75rem !important;
}

/* =============================================================================
   INPUT CONTROLS & FORM OVERRIDES
   ============================================================================= */
.stNumberInput label, .stSelectbox label, .stTextInput label, .stSlider label {
    color: #1e293b !important;
    font-weight: 600 !important;
    font-size: 0.88rem !important;
}

.stNumberInput input, .stTextInput input {
    background-color: #ffffff !important;
    color: #0f172a !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 10px !important;
    padding: 10px 14px !important;
    font-weight: 600 !important;
    font-size: 0.95rem !important;
}

.stNumberInput input:focus, .stTextInput input:focus {
    border-color: #2563eb !important;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15) !important;
}

.stSelectbox div[data-baseweb="select"] {
    background-color: #ffffff !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 10px !important;
    color: #0f172a !important;
}

.stSelectbox div[data-baseweb="select"] * {
    color: #0f172a !important;
    font-weight: 600 !important;
}

div[data-testid="stCheckbox"] label span p {
    color: #1e293b !important;
    font-weight: 600 !important;
    font-size: 0.9rem !important;
}

/* Action Buttons */
div.stButton > button {
    background-color: #2563eb !important;
    color: #ffffff !important;
    font-weight: 700 !important;
    font-size: 0.95rem !important;
    border-radius: 12px !important;
    height: 46px !important;
    width: 100% !important;
    border: none !important;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25) !important;
    transition: all 0.2s ease !important;
    cursor: pointer !important;
}

div.stButton > button:hover {
    background-color: #1d4ed8 !important;
    transform: translateY(-1px) !important;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35) !important;
}

/* =============================================================================
   EXPANDERS, TABLES, & ALERTS
   ============================================================================= */
div[data-testid="stExpander"] {
    background-color: #ffffff !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 14px !important;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03) !important;
    overflow: hidden !important;
}

div[data-testid="stExpander"] summary {
    font-weight: 700 !important;
    color: #0f172a !important;
    padding: 14px 18px !important;
}

div[data-testid="stExpander"] summary:hover {
    color: #2563eb !important;
    background-color: #f8fafc !important;
}

.stDataFrame {
    border: 1px solid #e2e8f0 !important;
    border-radius: 12px !important;
    overflow: hidden !important;
    background-color: #ffffff !important;
}

div[data-testid="stAlert"] {
    border-radius: 12px !important;
    padding: 14px 18px !important;
}

h1, h2, h3, h4, h5, h6 {
    color: #0f172a !important;
    font-weight: 700 !important;
    letter-spacing: -0.02em !important;
}
</style>
""", unsafe_allow_html=True)

# =============================================================================
# TOP HERO BANNER & QUICK START USER GUIDE
# =============================================================================
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

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================
SIGMA = 5.670374419e-8  # Stefan-Boltzmann constant W/(m^2 K^4)

# =============================================================================
# SIDEBAR NAVIGATION & GLOBAL SETTINGS
# =============================================================================
st.sidebar.markdown(
    """
    <div style="text-align: center; padding: 10px 0 15px 0;">
        <h2 style="margin:0; font-weight:700; color:#2563eb;">🔥 Heat Transport</h2>
        <p style="margin:4px 0 0 0; font-size:0.82rem; color:#64748b;">Engineering Analysis Suite</p>
    </div>
    """,
    unsafe_allow_html=True,
)

with st.sidebar.expander("📂 SELECT ANALYSIS MODULE", expanded=True):
    module_selection = st.radio(
        "Choose module:",
        [
            "Module 1: Multi-Layer Resistance Networks",
            "Module 2: Extended Surfaces / Fins Analysis",
            "Module 3: Critical Radius of Insulation Analyser",
        ],
        index=0,
        label_visibility="collapsed"
    )

st.sidebar.markdown("---")
st.sidebar.markdown("**💡 Thermal Formula Reference**")
st.sidebar.latex(r"R_{\text{cond, wall}} = \frac{L}{k \cdot A}")
st.sidebar.latex(r"R_{\text{cond, cyl}} = \frac{\ln(r_2/r_1)}{2\pi k L}")
st.sidebar.latex(r"R_{\text{cond, sph}} = \frac{r_2 - r_1}{4\pi k r_1 r_2}")
st.sidebar.latex(r"R_{\text{conv}} = \frac{1}{h \cdot A}")
st.sidebar.latex(r"r_{\text{cr}} = \frac{k}{h} \quad \text{(Cylinder)}")

# =============================================================================
# MODULE 1: MULTI-LAYER RESISTANCE NETWORKS
# =============================================================================
if module_selection == "Module 1: Multi-Layer Resistance Networks":
    col_hero_left, col_hero_right = st.columns([2, 1])
    with col_hero_left:
        st.markdown(
            """
            <div class="app-hero">
                <div>
                    <span class="phase-badge phase-active">Phase 1: Setup</span>
                    <span class="phase-badge phase-idle">Phase 2: Solve</span>
                </div>
                <h1 style="margin: 12px 0 8px 0; font-size: 2.1rem; font-weight: 700; color: #0f172a;">
                    Composite Thermal Resistance Networks
                </h1>
                <p style="color: #475569; font-size: 0.95rem; line-height: 1.5; margin: 0;">
                    Analyse heat flux and interface temperature profiles across multi-layer Cartesian walls, 
                    hollow cylinders, and concentric spheres with combined conduction, convection, and radiation boundary modes.
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with col_hero_right:
        st.markdown(
            """
            <div class="app-hero" style="text-align: center; padding: 20px;">
                <span style="font-size: 2.5rem;">🧱</span>
                <h4 style="margin: 8px 0 4px 0; color: #0f172a;">1D Heat Diffusion</h4>
                <p style="font-size: 0.8rem; color: #64748b; margin: 0;">Steady-State • Constant Properties • No Internal Generation</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    col_ctrl, col_display = st.columns([1, 1.4])

    with col_ctrl:
        st.markdown('<div class="app-card">', unsafe_allow_html=True)
        st.subheader("1. System Geometry & Boundaries")
        
        geometry = st.selectbox("Geometry Type", ["Plane Wall", "Hollow Cylinder", "Hollow Sphere"])
        
        if geometry == "Plane Wall":
            area = st.number_input("Cross-sectional Area A (m²)", min_value=0.001, value=1.0, step=0.1)
        else:
            length = st.number_input("Axial Length L (m)", min_value=0.001, value=1.0, step=0.1)

        st.markdown("---")
        st.subheader("2. Heat Transfer Modes & Fluids")
        
        enable_inner_conv = st.checkbox("Inner Convection Boundary", value=True)
        if enable_inner_conv:
            c1, c2 = st.columns(2)
            h_i = c1.number_input("Inner h_i (W/m²·K)", min_value=0.1, value=50.0, step=5.0)
            T_inf_i = c2.number_input("Inner Temp T_∞,i (°C)", value=120.0, step=5.0)
        else:
            h_i = None
            T_inf_i = st.number_input("Inner Surface Temp T_s,in (°C)", value=120.0, step=5.0)

        enable_outer_conv = st.checkbox("Outer Convection Boundary", value=True)
        if enable_outer_conv:
            c1, c2 = st.columns(2)
            h_o = c1.number_input("Outer h_o (W/m²·K)", min_value=0.1, value=15.0, step=1.0)
            T_inf_o = c2.number_input("Outer Temp T_∞,o (°C)", value=20.0, step=5.0)
        else:
            h_o = None
            T_inf_o = st.number_input("Outer Surface Temp T_s,out (°C)", value=20.0, step=5.0)

        st.markdown("---")
        st.subheader("3. Material Layers (Conduction)")
        
        num_layers = st.slider("Number of Solid Composite Layers", min_value=1, max_value=3, value=2)
        
        layers_data = []
        if geometry == "Plane Wall":
            for i in range(num_layers):
                st.markdown(f"**Layer {i+1}**")
                c1, c2 = st.columns(2)
                thick = c1.number_input(f"Thickness L_{i+1} (m)", min_value=0.001, value=0.05 * (i+1), step=0.01, key=f"thick_{i}")
                k_val = c2.number_input(f"Conductivity k_{i+1} (W/m·K)", min_value=0.01, value=15.0 if i==0 else 0.15, step=0.5, key=f"k_{i}")
                layers_data.append({"thick": thick, "k": k_val})
        else:
            r_in = st.number_input("Inner Radius r_1 (m)", min_value=0.001, value=0.05, step=0.01)
            radii = [r_in]
            for i in range(num_layers):
                st.markdown(f"**Layer {i+1}**")
                c1, c2 = st.columns(2)
                r_next = c1.number_input(f"Outer Radius r_{i+2} (m)", min_value=radii[-1] + 0.001, value=radii[-1] + 0.02, step=0.01, key=f"r_{i}")
                k_val = c2.number_input(f"Conductivity k_{i+1} (W/m·K)", min_value=0.01, value=25.0 if i==0 else 0.08, step=0.5, key=f"k_{i}")
                radii.append(r_next)
                layers_data.append({"r_in": radii[i], "r_out": radii[i+1], "k": k_val})

        st.markdown("</div>", unsafe_allow_html=True)

    with col_display:
        st.markdown('<div class="app-card">', unsafe_allow_html=True)
        st.subheader("Thermal Network Solution & Analytics")
        
        resistances = []
        nodes = []
        
        if geometry == "Plane Wall":
            A_wall = area
            current_x = 0.0
            nodes.append({"name": "Inner Ambient" if enable_inner_conv else "Inner Surface", "pos": current_x})
            
            if enable_inner_conv:
                R_i = 1.0 / (h_i * A_wall)
                resistances.append({"type": "Inner Conv", "R": R_i, "formula": r"R = \frac{1}{h_i A}"})
                current_x += 0.01
                nodes.append({"name": "Surface 1 (T_s1)", "pos": current_x})

            for i, layer in enumerate(layers_data):
                R_cond = layer["thick"] / (layer["k"] * A_wall)
                resistances.append({"type": f"Cond Layer {i+1}", "R": R_cond, "formula": r"R = \frac{L}{k A}"})
                current_x += layer["thick"]
                nodes.append({"name": f"Interface {i+2} (T_s{i+2})", "pos": current_x})
                
            if enable_outer_conv:
                R_o = 1.0 / (h_o * A_wall)
                resistances.append({"type": "Outer Conv", "R": R_o, "formula": r"R = \frac{1}{h_o A}"})
                current_x += 0.01
                nodes.append({"name": "Outer Ambient", "pos": current_x})

        elif geometry == "Hollow Cylinder":
            L_cyl = length
            r_first = layers_data[0]["r_in"]
            r_last = layers_data[-1]["r_out"]
            
            A_in = 2.0 * math.pi * r_first * L_cyl
            A_out = 2.0 * math.pi * r_last * L_cyl
            
            nodes.append({"name": "Inner Fluid" if enable_inner_conv else "Inner Wall", "pos": r_first if not enable_inner_conv else r_first * 0.9})
            if enable_inner_conv:
                R_i = 1.0 / (h_i * A_in)
                resistances.append({"type": "Inner Conv", "R": R_i, "formula": r"R = \frac{1}{h_i 2\pi r_1 L}"})
                nodes.append({"name": "Surface 1 (r_1)", "pos": r_first})

            for i, layer in enumerate(layers_data):
                r1 = layer["r_in"]
                r2 = layer["r_out"]
                R_cond = math.log(r2 / r1) / (2.0 * math.pi * layer["k"] * L_cyl)
                resistances.append({"type": f"Cond Layer {i+1}", "R": R_cond, "formula": r"R = \frac{\ln(r_2/r_1)}{2\pi k L}"})
                nodes.append({"name": f"Interface r_{i+2}", "pos": r2})

            if enable_outer_conv:
                R_o = 1.0 / (h_o * A_out)
                resistances.append({"type": "Outer Conv", "R": R_o, "formula": r"R = \frac{1}{h_o 2\pi r_{\text{out}} L}"})
                nodes.append({"name": "Outer Fluid", "pos": r_last * 1.1})

        else: # Hollow Sphere
            r_first = layers_data[0]["r_in"]
            r_last = layers_data[-1]["r_out"]
            
            A_in = 4.0 * math.pi * (r_first ** 2)
            A_out = 4.0 * math.pi * (r_last ** 2)
            
            nodes.append({"name": "Inner Fluid" if enable_inner_conv else "Inner Wall", "pos": r_first if not enable_inner_conv else r_first * 0.9})
            if enable_inner_conv:
                R_i = 1.0 / (h_i * A_in)
                resistances.append({"type": "Inner Conv", "R": R_i, "formula": r"R = \frac{1}{h_i 4\pi r_1^2}"})
                nodes.append({"name": "Surface 1 (r_1)", "pos": r_first})

            for i, layer in enumerate(layers_data):
                r1 = layer["r_in"]
                r2 = layer["r_out"]
                R_cond = (r2 - r1) / (4.0 * math.pi * layer["k"] * r1 * r2)
                resistances.append({"type": f"Cond Layer {i+1}", "R": R_cond, "formula": r"R = \frac{r_2 - r_1}{4\pi k r_1 r_2}"})
                nodes.append({"name": f"Interface r_{i+2}", "pos": r2})

            if enable_outer_conv:
                R_o = 1.0 / (h_o * A_out)
                resistances.append({"type": "Outer Conv", "R": R_o, "formula": r"R = \frac{1}{h_o 4\pi r_{\text{out}}^2}"})
                nodes.append({"name": "Outer Fluid", "pos": r_last * 1.1})

        R_total = sum(r["R"] for r in resistances)
        Delta_T = T_inf_i - T_inf_o
        Q_total = Delta_T / R_total if R_total > 0 else 0.0

        temps = [T_inf_i]
        curr_T = T_inf_i
        for r_item in resistances:
            curr_T -= Q_total * r_item["R"]
            temps.append(curr_T)

        m1, m2, m3 = st.columns(3)
        m1.metric("Total Resistance R_tot", f"{R_total:.4f} K/W")
        m2.metric("Heat Transport Q", f"{Q_total:.2f} W")
        m3.metric("Overall ΔT", f"{Delta_T:.1f} °C")

        st.markdown("---")
        st.subheader("Temperature Cascade Profile")

        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=[n["pos"] for n in nodes],
            y=temps,
            mode='lines+markers+text',
            name='Temperature (°C)',
            text=[f"{t:.1f}°C" for t in temps],
            textposition="top center",
            line=dict(color='#2563eb', width=3),
            marker=dict(size=10, color='#3b82f6', symbol='circle')
        ))

        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='#ffffff',
            font=dict(color='#475569', family='Open Sans'),
            xaxis=dict(title="Position / Radius (m)", gridcolor='#e2e8f0'),
            yaxis=dict(title="Temperature (°C)", gridcolor='#e2e8f0'),
            margin=dict(l=20, r=20, t=30, b=20),
            height=320,
        )

        st.plotly_chart(fig, use_container_width=True)

        st.subheader("Resistance Breakdown Table")
        df_res = pd.DataFrame([
            {
                "Resistance Element": r["type"],
                "R Value (K/W)": f"{r['R']:.5f}",
                "% of Total R": f"{(r['R']/R_total)*100:.1f}%",
                "Formula": r["formula"]
            }
            for r in resistances
        ])
        st.dataframe(df_res, use_container_width=True)

        st.markdown("</div>", unsafe_allow_html=True)


# =============================================================================
# MODULE 2: EXTENDED SURFACES / FINS ANALYSIS
# =============================================================================
elif module_selection == "Module 2: Extended Surfaces / Fins Analysis":
    col_hero_left, col_hero_right = st.columns([2, 1])
    with col_hero_left:
        st.markdown(
            """
            <div class="app-hero">
                <div>
                    <span class="phase-badge phase-active">Infinitely Long Fin</span>
                    <span class="phase-badge phase-idle">Steady State</span>
                </div>
                <h1 style="margin: 12px 0 8px 0; font-size: 2.1rem; font-weight: 700; color: #0f172a;">
                    Extended Surface Thermal Dissipation
                </h1>
                <p style="color: #475569; font-size: 0.95rem; line-height: 1.5; margin: 0;">
                    Calculate conduction-convection coupled heat loss and spatial exponential temperature decay 
                    along infinitely long rectangular or cylindrical pin fins.
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with col_hero_right:
        st.markdown(
            """
            <div class="app-hero" style="text-align: center; padding: 20px;">
                <span style="font-size: 2.5rem;">⚡</span>
                <h4 style="margin: 8px 0 4px 0; color: #0f172a;">1D Fin Analytical Model</h4>
                <p style="font-size: 0.8rem; color: #64748b; margin: 0;">Spatial Temperature Decay</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    st.latex(r"T(x) = T_\infty + (T_b - T_\infty) \cdot e^{-m x}, \quad m = \sqrt{\frac{h P}{k A_c}}, \quad Q_{\text{fin}} = \sqrt{h P k A_c} \cdot (T_b - T_\infty)")

    col_ctrl, col_display = st.columns([1, 1.4])

    with col_ctrl:
        st.markdown('<div class="app-card">', unsafe_allow_html=True)
        st.subheader("1. Fin Geometry & Operating Temps")

        fin_type = st.selectbox("Fin Cross-Section", ["Rectangular Fin", "Pin Fin (Circular)"])

        c1, c2 = st.columns(2)
        T_b = c1.number_input("Base Temp T_b (°C)", value=150.0, step=5.0)
        T_inf = c2.number_input("Ambient Temp T_∞ (°C)", value=25.0, step=5.0)

        c1, c2 = st.columns(2)
        k_fin = c1.number_input("Conductivity k (W/m·K)", min_value=0.1, value=200.0, step=10.0)
        h_fin = c2.number_input("Conv. Coeff h (W/m²·K)", min_value=0.1, value=35.0, step=5.0)

        fin_length = st.number_input("Fin Length L (m)", min_value=0.01, value=0.15, step=0.01)

        st.markdown("---")
        st.subheader("2. Fin Cross-Sectional Dimensions")

        if fin_type == "Rectangular Fin":
            c1, c2 = st.columns(2)
            width = c1.number_input("Width w (m)", min_value=0.001, value=0.05, step=0.005)
            thickness = c2.number_input("Thickness t (m)", min_value=0.0005, value=0.003, step=0.0005)
            P_fin = 2.0 * (width + thickness)
            Ac_fin = width * thickness
        else:
            diameter = st.number_input("Pin Diameter D (m)", min_value=0.001, value=0.008, step=0.001)
            P_fin = math.pi * diameter
            Ac_fin = (math.pi * (diameter ** 2)) / 4.0

        st.markdown("</div>", unsafe_allow_html=True)

    with col_display:
        st.markdown('<div class="app-card">', unsafe_allow_html=True)
        st.subheader("Fin Performance & Temperature Analytics")

        if k_fin > 0 and Ac_fin > 0 and P_fin > 0:
            m_param = math.sqrt((h_fin * P_fin) / (k_fin * Ac_fin))
            M_param = math.sqrt(h_fin * P_fin * k_fin * Ac_fin) * (T_b - T_inf)
            Q_fin = M_param

            Q_max = h_fin * (P_fin * fin_length) * (T_b - T_inf)
            eta_fin = (Q_fin / Q_max) * 100 if Q_max > 0 else 0.0
            
            Q_no_fin = h_fin * Ac_fin * (T_b - T_inf)
            epsilon_fin = Q_fin / Q_no_fin if Q_no_fin > 0 else 0.0

            m1, m2, m3 = st.columns(3)
            m1.metric("Fin Parameter m", f"{m_param:.2f} m⁻¹")
            m2.metric("Fin Heat Loss Q_fin", f"{Q_fin:.2f} W")
            m3.metric("Effectiveness ε_fin", f"{epsilon_fin:.2f} x")

            st.markdown("---")
            st.subheader("Spatial Temperature Distribution along Fin Length x")

            x_vals = np.linspace(0, fin_length, 100)
            T_vals = T_inf + (T_b - T_inf) * np.exp(-m_param * x_vals)

            fig = go.Figure()
            fig.add_trace(go.Scatter(
                x=x_vals,
                y=T_vals,
                mode='lines',
                name='T(x)',
                line=dict(color='#e11d48', width=3),
            ))

            fig.add_hline(y=T_inf, line_dash="dash", line_color="#64748b", annotation_text="T_ambient")

            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='#ffffff',
                font=dict(color='#475569', family='Open Sans'),
                xaxis=dict(title="Distance from Base x (m)", gridcolor='#e2e8f0'),
                yaxis=dict(title="Temperature (°C)", gridcolor='#e2e8f0'),
                margin=dict(l=20, r=20, t=30, b=20),
                height=320,
            )

            st.plotly_chart(fig, use_container_width=True)

            df_fin = pd.DataFrame([
                {"Parameter": "Fin Parameter (m)", "Value": f"{m_param:.4f} m⁻¹", "Description": "m = sqrt(hP / kA_c)"},
                {"Parameter": "Fin Heat Transfer (Q_fin)", "Value": f"{Q_fin:.4f} W", "Description": "Q = sqrt(hPkA_c) * (T_b - T_inf)"},
                {"Parameter": "Fin Effectiveness (ε_fin)", "Value": f"{epsilon_fin:.2f}", "Description": "ε = Q_fin / Q_unfinned"},
                {"Parameter": "Fin Efficiency (η_fin)", "Value": f"{eta_fin:.1f}%", "Description": "η = Q_fin / Q_max"},
            ])
            st.dataframe(df_fin, use_container_width=True)

        st.markdown("</div>", unsafe_allow_html=True)


# =============================================================================
# MODULE 3: CRITICAL RADIUS OF INSULATION ANALYSER
# =============================================================================
else:
    col_hero_left, col_hero_right = st.columns([2, 1])
    with col_hero_left:
        st.markdown(
            """
            <div class="app-hero">
                <div>
                    <span class="phase-badge phase-active">Optimum Insulation</span>
                    <span class="phase-badge phase-idle">r_cr Peak</span>
                </div>
                <h1 style="margin: 12px 0 8px 0; font-size: 2.1rem; font-weight: 700; color: #0f172a;">
                    Critical Radius of Insulation Analyser
                </h1>
                <p style="color: #475569; font-size: 0.95rem; line-height: 1.5; margin: 0;">
                    Determine whether adding insulation increases or decreases total heat loss for cylindrical cables 
                    and spherical pressure vessels by locating the critical thermal resistance extremum.
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )
    with col_hero_right:
        st.markdown(
            """
            <div class="app-hero" style="text-align: center; padding: 20px;">
                <span style="font-size: 2.5rem;">⭕</span>
                <h4 style="margin: 8px 0 4px 0; color: #0f172a;">Thermal Trade-off</h4>
                <p style="font-size: 0.8rem; color: #64748b; margin: 0;">R_cond ↑ vs R_conv ↓ with Radius</p>
            </div>
            """,
            unsafe_allow_html=True,
        )

    st.latex(r"r_{\text{cr, cylinder}} = \frac{k}{h}, \qquad r_{\text{cr, sphere}} = \frac{2k}{h}")

    col_ctrl, col_display = st.columns([1, 1.4])

    with col_ctrl:
        st.markdown('<div class="app-card">', unsafe_allow_html=True)
        st.subheader("1. Geometry & Thermal Parameters")

        cr_geometry = st.selectbox("Structure Geometry", ["Cylinder (Pipe / Cable)", "Sphere (Vessel / Tank)"])

        r_inner = st.number_input("Inner Surface Radius r_i (m)", min_value=0.001, value=0.01, step=0.002, format="%.4f")
        k_ins = st.number_input("Insulation Conductivity k (W/m·K)", min_value=0.001, value=0.05, step=0.01)
        h_out = st.number_input("Outer Conv Coefficient h (W/m²·K)", min_value=0.1, value=5.0, step=1.0)

        if "Cylinder" in cr_geometry:
            pipe_len = st.number_input("Cylinder Length L (m)", min_value=0.1, value=1.0, step=0.5)

        c1, c2 = st.columns(2)
        T_surface = c1.number_input("Surface Temp T_i (°C)", value=90.0, step=5.0)
        T_ambient = c2.number_input("Ambient Temp T_∞ (°C)", value=20.0, step=5.0)

        st.markdown("</div>", unsafe_allow_html=True)

    with col_display:
        st.markdown('<div class="app-card">', unsafe_allow_html=True)
        st.subheader("Critical Radius Analysis & Heat Transfer Peak")

        if "Cylinder" in cr_geometry:
            r_cr = k_ins / h_out
        else:
            r_cr = (2.0 * k_ins) / h_out

        m1, m2 = st.columns(2)
        m1.metric("Critical Radius r_cr", f"{r_cr * 1000.0:.2f} mm")
        m2.metric("Current Inner Radius r_i", f"{r_inner * 1000.0:.2f} mm")

        if r_inner < r_cr:
            st.info(
                f"⚠️ **Notice**: Since r_i ({r_inner*1000:.1f} mm) < r_cr ({r_cr*1000:.1f} mm), adding insulation starting from r_i up to r_cr will **INCREASE** heat loss due to increasing outer surface area for convection!"
            )
        else:
            st.success(
                f"✅ **Safe**: Since r_i ({r_inner*1000:.1f} mm) > r_cr ({r_cr*1000:.1f} mm), adding insulation will **DECREASE** heat loss immediately."
            )

        st.markdown("---")

        r_max = max(r_cr * 3.0, r_inner * 3.0)
        r_outer_range = np.linspace(r_inner, r_max, 200)

        q_list = []
        r_list_mm = r_outer_range * 1000.0

        for r_o in r_outer_range:
            if "Cylinder" in cr_geometry:
                R_cond = math.log(r_o / r_inner) / (2.0 * math.pi * k_ins * pipe_len)
                R_conv = 1.0 / (h_out * 2.0 * math.pi * r_o * pipe_len)
            else:
                R_cond = (r_o - r_inner) / (4.0 * math.pi * k_ins * r_inner * r_o)
                R_conv = 1.0 / (h_out * 4.0 * math.pi * (r_o ** 2))
            
            R_tot = R_cond + R_conv
            q = (T_surface - T_ambient) / R_tot
            q_list.append(q)

        fig = go.Figure()

        fig.add_trace(go.Scatter(
            x=r_list_mm,
            y=q_list,
            mode='lines',
            name='Heat Loss Q (W)',
            line=dict(color='#059669', width=3),
        ))

        fig.add_vline(
            x=r_cr * 1000.0,
            line_dash="dash",
            line_color="#d97706",
            annotation_text=f"r_cr = {r_cr*1000:.2f} mm",
            annotation_position="top right"
        )

        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='#ffffff',
            font=dict(color='#475569', family='Open Sans'),
            xaxis=dict(title="Outer Insulation Radius r_o (mm)", gridcolor='#e2e8f0'),
            yaxis=dict(title="Heat Transfer Rate Q (W)", gridcolor='#e2e8f0'),
            margin=dict(l=20, r=20, t=30, b=20),
            height=320,
        )

        st.plotly_chart(fig, use_container_width=True)

        st.markdown("</div>", unsafe_allow_html=True)
