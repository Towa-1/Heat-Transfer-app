# Heat Transport Analyser 🔥

An interactive 1D steady-state thermal engineering application for modeling, simulating, and visualizing heat transfer processes across composite resistance networks, extended fin surfaces, and critical insulation geometries.

---

## 🌟 Overview

**Heat Transport Analyser** provides thermal engineers, researchers, and engineering students with analytical tools to model 1D heat transfer in steady-state systems.

The suite includes both:
1. **Interactive Web Application (React & Vite)**: An intuitive, responsive frontend with LaTeX formula rendering (`KaTeX`), parameter sliders, live interactive charts (`Recharts`), and user instructions.
2. **Python Streamlit Application (`app.py`)**: A standalone Python app powered by `Streamlit`, `Plotly`, `NumPy`, and `Pandas` for running thermal analysis in Python environments.

---

## 🚀 Modules & Capabilities

### 1. Multi-Layer Resistance Networks
- **Geometries Supported**: Flat Cartesian Walls, Hollow Cylindrical Pipes, and Concentric Spherical Vessels.
- **Physics**: Solves 1D steady-state conduction and fluid convection ($h_i, h_o$) across up to 5 composite layers.
- **Outputs**: Total system thermal resistance ($R_{\text{total}}$), heat flow rate ($Q$), internal interface temperatures ($T_1, T_2, \dots$), temperature distribution profile, and resistance breakdown tables.

### 2. Extended Surface Fin Heat Dissipation
- **Fin Types**: Rectangular Fins & Pin (Circular) Fins.
- **Physics**: Calculates fin parameter $m = \sqrt{\frac{h P}{k A_c}}$, total heat dissipation $Q_{\text{fin}}$, fin effectiveness ($\epsilon_{\text{fin}}$), and spatial temperature decay along the fin length $x$.
- **Outputs**: Interactive temperature distribution curve $T(x)$ and fin performance indicators.

### 3. Critical Radius of Insulation
- **Geometries**: Cylindrical Pipes/Cables and Spherical Tanks/Vessels.
- **Physics**: Computes critical insulation radius ($r_{\text{cr}} = \frac{k}{h}$ for cylinders, $r_{\text{cr}} = \frac{2k}{h}$ for spheres) where total thermal resistance is minimized.
- **Outputs**: Peak heat dissipation curve versus outer insulation radius $r_o$ and thermal trade-off warnings.

---

## 📦 Python Installation & Setup (`app.py`)

To run the Python Streamlit version of the analyzer:

### 1. Clone & Navigate
```bash
git clone <repository-url>
cd heat-transport-analyser
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Launch Streamlit Application
```bash
streamlit run app.py
```

---

## 💻 Web App Setup (React + Vite)

To run the React frontend locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

---

## 🛠️ Project Structure

```
.
├── app.py                # Python Streamlit application
├── requirements.txt      # Python dependencies
├── package.json          # Node.js dependencies & scripts
├── src/
│   ├── App.tsx           # Primary React web application entry point
│   ├── main.tsx          # React application root
│   └── index.css         # Tailwind CSS & global styling
├── public/               # Static assets
└── README.md             # Project documentation
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
