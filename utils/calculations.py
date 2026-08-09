"""
===============================================================================
MODULE: utils/calculations.py
DESCRIPTION: Analytical physics functions for 1D steady-state heat transport.
===============================================================================
"""

import math
import numpy as np

def calculate_wall_resistance(thickness: float, k: float, area: float) -> float:
    """Calculates conduction resistance for a Cartesian plane wall layer: R = L / (k * A)"""
    if k <= 0 or area <= 0:
        return 0.0
    return thickness / (k * area)

def calculate_cylinder_resistance(r1: float, r2: float, k: float, length: float) -> float:
    """Calculates conduction resistance for a hollow cylindrical layer: R = ln(r2/r1) / (2 * pi * k * L)"""
    if k <= 0 or length <= 0 or r1 <= 0 or r2 <= r1:
        return 0.0
    return math.log(r2 / r1) / (2.0 * math.pi * k * length)

def calculate_sphere_resistance(r1: float, r2: float, k: float) -> float:
    """Calculates conduction resistance for a hollow spherical layer: R = (r2 - r1) / (4 * pi * k * r1 * r2)"""
    if k <= 0 or r1 <= 0 or r2 <= r1:
        return 0.0
    return (r2 - r1) / (4.0 * math.pi * k * r1 * r2)

def calculate_convection_resistance(h: float, area: float) -> float:
    """Calculates convection resistance: R = 1 / (h * A)"""
    if h <= 0 or area <= 0:
        return 0.0
    return 1.0 / (h * area)

def calculate_fin_parameters(h: float, P: float, k: float, Ac: float, Tb: float, Tinf: float, length: float):
    """
    Calculates extended fin surface parameters:
    m = sqrt(h*P / (k*Ac))
    Q_fin = sqrt(h*P*k*Ac) * (Tb - Tinf)
    epsilon_fin = Q_fin / (h * Ac * (Tb - Tinf))
    eta_fin = Q_fin / (h * P * L * (Tb - Tinf))
    """
    if k <= 0 or Ac <= 0 or P <= 0 or h <= 0:
        return 0.0, 0.0, 0.0, 0.0
    
    m = math.sqrt((h * P) / (k * Ac))
    Q_fin = math.sqrt(h * P * k * Ac) * (Tb - Tinf)
    
    Q_no_fin = h * Ac * (Tb - Tinf)
    epsilon_fin = Q_fin / Q_no_fin if Q_no_fin > 0 else 0.0
    
    Q_max = h * (P * length) * (Tb - Tinf)
    eta_fin = (Q_fin / Q_max) * 100.0 if Q_max > 0 else 0.0
    
    return m, Q_fin, epsilon_fin, eta_fin

def calculate_critical_radius(geometry_type: str, k_ins: float, h_out: float) -> float:
    """
    Computes critical insulation radius:
    Cylinder: r_cr = k / h
    Sphere: r_cr = 2k / h
    """
    if h_out <= 0:
        return 0.0
    if "Cylinder" in geometry_type:
        return k_ins / h_out
    else:
        return (2.0 * k_ins) / h_out
