"""
==============================================================================
AI ASSISTED DEVELOPMENT DOCUMENTATION
==============================================================================
AI Tools Used: 
- Google AI Studio (Gemini)

Key Prompts Given:
1. "Build a multi-geometry thermal resistance network calculator with custom CSS styling."
2. "Integrate extended surface fin temperature profiles and critical insulation radius plots using Plotly."
3. "Apply a clean light engineering theme override with Inter typography and custom card components."

Manual Verification & Edits:
- Fixed st.dataframe LaTeX rendering by using clean Unicode mathematical expressions.
- Corrected Plotly axis text colors to dark slate for high contrast visibility.
- Removed empty div wrappers causing ghost whitespace cards.
==============================================================================
"""

import math
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
# CLEAN INLINE STYLESHEET (High Contrast Light Theme)
# =============================================================================
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

html, body, [class*="css"], .stApp {
    font-family: 'Inter', sans-serif !important;
    background-color: #f8fafc !important;
    color: #0f172a !important;
}

#MainMenu, footer { visibility: hidden; }
header[data-testid="stHeader"] { background: transparent !important; }

/* Custom Card Layouts */
.app-hero {
    background: #ffffff !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 16px !important;
    padding: 24px !important;
    margin-bottom: 16px !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04) !important;
}

.phase-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    margin-right: 6px;
}
.phase-active { background-color: #dbeafe; color: #1d4ed8; }
.phase-idle { background-color: #f1f5f9; color: #64748b; }

/* Metric Overrides */
div[data-testid="stMetric"] {
    background-color: #ffffff !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 12px !important;
    padding: 12px 16px !important;
}
div[data-testid="stMetricLabel"] { color: #475569 !important; font-weight: 600 !important; }
div[data-testid="stMetricValue"] { color: #0f172a !important; font-weight: 700 !important; }

/* Input Styling */
.stNumberInput input, .stSelectbox div[data-baseweb="select"] {
    background-color: #ffffff !important;
    color: #0f172a !important;
    border: 1px solid #cbd5e1 !important;
    border-radius: 8px !important;
}

/* DataFrame Styling */
.stDataFrame {
    border: 1px solid #cbd5e1 !important;
    border-radius: 10px !important;
}
</style>
""", unsafe_allow_html=True)

# =============================================================================
# TOP HERO BANNER & USER GUIDE
# =============================================================================
st.markdown("""
<div style="background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%); padding: 32px; border-radius: 16px; color: white; margin-bottom: 20px;">
    <span style="background-color: rgba(255,255,255,0.15); padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">Thermal Engineering Suite</span>
    <h1 style="font-size: 2rem; font-weight: 700; margin: 8px 0 6px 0; color: white;">Heat Transport Analyser</h1>
    <p style="color: rgba(255,255,255,0.85); font-size: 0.95rem; margin: 0;">
        Model and analyze 1D steady-state heat conduction across composite walls, cylinders, spheres, extended surface fins, and critical insulation geometries.
    </p>
</div>
""", unsafe_allow_html=True)

with st.expander("📖 Quick Start User Guide", expanded=False):
    st.markdown("""
    1. **Select Module**: Choose your desired analysis topic from the left sidebar.
    2. **Input Parameters**: Enter material conductivities ($k$), dimensions ($L, r$), and film coefficients ($h$).
    3. **View Results**: Inspect heat transfer rate $Q$, resistance tables, and high-contrast Plotly plots.
    """)

# =============================================================================
# SIDEBAR
# =============================================================================
st.sidebar.title("🔥 Heat Transport")
module_selection = st.sidebar.radio(
    "Choose Module:",
    [
        "Module 1: Multi-Layer Resistance Networks",
        "Module 2: Extended Surfaces / Fins Analysis",
        "Module 3: Critical Radius of Insulation Analyser"
    ]
)

st.sidebar.markdown("---")
st.sidebar.markdown("**💡 Formula Quick Reference**")
st.sidebar.latex(r"R_{\text{wall}} = \frac{L}{k A}")
st.sidebar.latex(r"R_{\text{cyl}} = \frac{\ln(r_2/r_1)}{2\pi k L}")
st.sidebar.latex(r"R_{\text{sph}} = \frac{r_2 - r_1}{4\pi k r_1 r_2}")
st.sidebar.latex(r"r_{\text{cr}} = \frac{k}{h}")

# =============================================================================
# MODULE 1: RESISTANCE NETWORKS
# =============================================================================
if module_selection == "Module 1: Multi-Layer Resistance Networks":
    col1, col2 = st.columns([1, 1.4])

    with col1:
        st.subheader("1. System Configuration")
        geometry = st.selectbox("Geometry Type", ["Plane Wall", "Hollow Cylinder", "Hollow Sphere"])
        
        if geometry == "Plane Wall":
            area = st.number_input("Cross-sectional Area A (m²)", min_value=0.001, value=1.0, step=0.1)
        else:
            length = st.number_input("Axial Length L (m)", min_value=0.001, value=1.0, step=0.1)

        st.markdown("---")
        st.subheader("2. Boundaries")
        enable_inner_conv = st.checkbox("Inner Convection", value=True)
        if enable_inner_conv:
            c1, c2 = st.columns(2)
            h_i = c1.number_input("Inner h_i (W/m²K)", min_value=0.1, value=50.0)
            T_inf_i = c2.number_input("Inner Temp (°C)", value=120.0)
        else:
            h_i = None
            T_inf_i = st.number_input("Inner Surface Temp (°C)", value=120.0)

        enable_outer_conv = st.checkbox("Outer Convection", value=True)
        if enable_outer_conv:
            c1, c2 = st.columns(2)
            h_o = c1.number_input("Outer h_o (W/m²K)", min_value=0.1, value=15.0)
            T_inf_o = c2.number_input("Outer Temp (°C)", value=20.0)
        else:
            h_o = None
            T_inf_o = st.number_input("Outer Surface Temp (°C)", value=20.0)

        st.markdown("---")
        st.subheader("3. Solid Layers")
        num_layers = st.slider("Number of Layers", min_value=1, max_value=3, value=2)
        
        layers_data = []
        if geometry == "Plane Wall":
            for i in range(num_layers):
                c1, c2 = st.columns(2)
                thick = c1.number_input(f"Thickness L{i+1} (m)", min_value=0.001, value=0.05*(i+1), key=f"L_{i}")
                k_val = c2.number_input(f"Conductivity k{i+1} (W/mK)", min_value=0.01, value=15.0 if i==0 else 0.15, key=f"k_{i}")
                layers_data.append({"thick": thick, "k": k_val})
        else:
            r_in = st.number_input("Inner Radius r1 (m)", min_value=0.001, value=0.05)
            radii = [r_in]
            for i in range(num_layers):
                c1, c2 = st.columns(2)
                r_next = c1.number_input(f"Outer Radius r{i+2} (m)", min_value=radii[-1]+0.001, value=radii[-1]+0.02, key=f"r_{i}")
                k_val = c2.number_input(f"Conductivity k{i+1} (W/mK)", min_value=0.01, value=25.0 if i==0 else 0.08, key=f"k_{i}")
                radii.append(r_next)
                layers_data.append({"r_in": radii[i], "r_out": radii[i+1], "k": k_val})

    with col2:
        st.subheader("Thermal Network Analytics")
        
        resistances = []
        nodes = []
        
        if geometry == "Plane Wall":
            A_wall = area
            curr_x = 0.0
            nodes.append({"name": "Inner Ambient" if enable_inner_conv else "Inner Surface", "pos": curr_x})
            if enable_inner_conv:
                R_i = 1.0 / (h_i * A_wall)
                resistances.append({"type": "Inner Conv", "R": R_i, "formula": "1 / (h_i × A)"})
                curr_x += 0.01
                nodes.append({"name": "Surface 1", "pos": curr_x})
            for i, layer in enumerate(layers_data):
                R_cond = layer["thick"] / (layer["k"] * A_wall)
                resistances.append({"type": f"Cond Layer {i+1}", "R": R_cond, "formula": "L / (k × A)"})
                curr_x += layer["thick"]
                nodes.append({"name": f"Interface {i+2}", "pos": curr_x})
            if enable_outer_conv:
                R_o = 1.0 / (h_o * A_wall)
                resistances.append({"type": "Outer Conv", "R": R_o, "formula": "1 / (h_o × A)"})
                curr_x += 0.01
                nodes.append({"name": "Outer Ambient", "pos": curr_x})

        elif geometry == "Hollow Cylinder":
            L_cyl = length
            r_first = layers_data[0]["r_in"]
            r_last = layers_data[-1]["r_out"]
            A_in = 2.0 * math.pi * r_first * L_cyl
            A_out = 2.0 * math.pi * r_last * L_cyl
            nodes.append({"name": "Inner Fluid" if enable_inner_conv else "Inner Wall", "pos": r_first})
            if enable_inner_conv:
                R_i = 1.0 / (h_i * A_in)
                resistances.append({"type": "Inner Conv", "R": R_i, "formula": "1 / (h_i × 2π × r_1 × L)"})
            for i, layer in enumerate(layers_data):
                r1, r2 = layer["r_in"], layer["r_out"]
                R_cond = math.log(r2 / r1) / (2.0 * math.pi * layer["k"] * L_cyl)
                resistances.append({"type": f"Cond Layer {i+1}", "R": R_cond, "formula": "ln(r_2/r_1) / (2π × k × L)"})
                nodes.append({"name": f"Interface r{i+2}", "pos": r2})
            if enable_outer_conv:
                R_o = 1.0 / (h_o * A_out)
                resistances.append({"type": "Outer Conv", "R": R_o, "formula": "1 / (h_o × 2π × r_out × L)"})
                nodes.append({"name": "Outer Fluid", "pos": r_last * 1.05})

        else: # Hollow Sphere
            r_first = layers_data[0]["r_in"]
            r_last = layers_data[-1]["r_out"]
            A_in = 4.0 * math.pi * (r_first**2)
            A_out = 4.0 * math.pi * (r_last**2)
            nodes.append({"name": "Inner Fluid" if enable_inner_conv else "Inner Wall", "pos": r_first})
            if enable_inner_conv:
                R_i = 1.0 / (h_i * A_in)
                resistances.append({"type": "Inner Conv", "R": R_i, "formula": "1 / (h_i × 4π × r_1²)"})
            for i, layer in enumerate(layers_data):
                r1, r2 = layer["r_in"], layer["r_out"]
                R_cond = (r2 - r1) / (4.0 * math.pi * layer["k"] * r1 * r2)
                resistances.append({"type": f"Cond Layer {i+1}", "R": R_cond, "formula": "(r_2 - r_1) / (4π × k × r_1 × r_2)"})
                nodes.append({"name": f"Interface r{i+2}", "pos": r2})
            if enable_outer_conv:
                R_o = 1.0 / (h_o * A_out)
                resistances.append({"type": "Outer Conv", "R": R_o, "formula": "1 / (h_o × 4π × r_out²)"})
                nodes.append({"name": "Outer Fluid", "pos": r_last * 1.05})

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
            mode='lines+markers',
            name='Temperature (°C)',
            line=dict(color='#2563eb', width=3),
            marker=dict(size=10, color='#1d4ed8')
        ))

        # HIGH CONTRAST PLOTLY COLORS (Dark Slate Text)
        fig.update_layout(
            paper_bgcolor='#ffffff',
            plot_bgcolor='#f8fafc',
            font=dict(color='#0f172a', family='Inter', size=12),
            xaxis=dict(title="Position / Radius (m)", gridcolor='#cbd5e1', color='#0f172a', showgrid=True),
            yaxis=dict(title="Temperature (°C)", gridcolor='#cbd5e1', color='#0f172a', showgrid=True),
            margin=dict(l=40, r=40, t=20, b=40),
            height=340,
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

# =============================================================================
# MODULE 2: FINS ANALYSIS
# =============================================================================
elif module_selection == "Module 2: Extended Surfaces / Fins Analysis":
    st.subheader("Extended Surface Thermal Dissipation")
    col1, col2 = st.columns([1, 1.4])
    
    with col1:
        fin_type = st.selectbox("Fin Cross-Section", ["Rectangular Fin", "Pin Fin (Circular)"])
        T_b = st.number_input("Base Temp T_b (°C)", value=150.0)
        T_inf = st.number_input("Ambient Temp T_∞ (°C)", value=25.0)
        k_fin = st.number_input("Conductivity k (W/mK)", value=200.0)
        h_fin = st.number_input("Conv. Coeff h (W/m²K)", value=35.0)
        fin_length = st.number_input("Fin Length L (m)", value=0.15)

        if fin_type == "Rectangular Fin":
            width = st.number_input("Width w (m)", value=0.05)
            thickness = st.number_input("Thickness t (m)", value=0.003)
            P_fin = 2.0 * (width + thickness)
            Ac_fin = width * thickness
        else:
            diameter = st.number_input("Pin Diameter D (m)", value=0.008)
            P_fin = math.pi * diameter
            Ac_fin = (math.pi * (diameter ** 2)) / 4.0

    with col2:
        m_param = math.sqrt((h_fin * P_fin) / (k_fin * Ac_fin))
        Q_fin = math.sqrt(h_fin * P_fin * k_fin * Ac_fin) * (T_b - T_inf)

        m1, m2 = st.columns(2)
        m1.metric("Fin Parameter m", f"{m_param:.2f} m⁻¹")
        m2.metric("Fin Heat Loss Q_fin", f"{Q_fin:.2f} W")

        x_vals = np.linspace(0, fin_length, 100)
        T_vals = T_inf + (T_b - T_inf) * np.exp(-m_param * x_vals)

        fig = go.Figure()
        fig.add_trace(go.Scatter(x=x_vals, y=T_vals, mode='lines', line=dict(color='#e11d48', width=3)))
        fig.update_layout(
            paper_bgcolor='#ffffff', plot_bgcolor='#f8fafc',
            font=dict(color='#0f172a'),
            xaxis=dict(title="Distance x (m)", gridcolor='#cbd5e1', color='#0f172a'),
            yaxis=dict(title="Temperature (°C)", gridcolor='#cbd5e1', color='#0f172a'),
            height=340
        )
        st.plotly_chart(fig, use_container_width=True)

# =============================================================================
# MODULE 3: CRITICAL RADIUS
# =============================================================================
else:
    st.subheader("Critical Radius of Insulation Analyser")
    col1, col2 = st.columns([1, 1.4])
    
    with col1:
        cr_geometry = st.selectbox("Structure Geometry", ["Cylinder (Pipe / Cable)", "Sphere (Vessel / Tank)"])
        r_inner = st.number_input("Inner Surface Radius r_i (m)", value=0.01, format="%.4f")
        k_ins = st.number_input("Insulation Conductivity k (W/mK)", value=0.05)
        h_out = st.number_input("Outer Conv Coefficient h (W/m²K)", value=5.0)

    with col2:
        r_cr = (k_ins / h_out) if "Cylinder" in cr_geometry else ((2.0 * k_ins) / h_out)
        st.metric("Critical Radius r_cr", f"{r_cr * 1000.0:.2f} mm")
        
        if r_inner < r_cr:
            st.warning("⚠️ Adding insulation up to r_cr will INCREASE heat loss.")
        else:
            st.success("✅ Adding insulation will DECREASE heat loss immediately.")
