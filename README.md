# Fuel Density Converter

A professional fuel density conversion application for petrol pumps and fuel distributors, based on the official ASTM 53 B table for accurate petroleum measurement conversions.

## Features

### 🎯 **ASTM 53 B Table Integration**
- **Official Standards**: Uses the complete ASTM 53 B table for petroleum measurement
- **Multiple Fuel Types**: Supports Petrol, Diesel, Kerosene, Aviation Fuel, and Biodiesel
- **Temperature Range**: Covers -10°C to 60°C with precise correction factors
- **Density Range**: Handles 700-900 kg/m³ with accurate interpolation

### 🔬 **Accurate Calculations**
- **Exact Values**: Direct table lookup for standard conditions
- **Linear Interpolation**: Precise calculations between table values
- **Fallback Methods**: Thermal expansion approximation when outside table ranges
- **Method Transparency**: Shows calculation method and accuracy level

### 📱 **User-Friendly Interface**
- **Modern Design**: Clean, professional interface suitable for commercial use
- **Input Validation**: Range checking and helpful guidance
- **Real-time Updates**: Dynamic fuel type and range information
- **Detailed Results**: Complete conversion information and methodology

## How It Works

### 1. **ASTM Table Method (Primary)**
The app uses the official ASTM 53 B table which provides Volume Correction Factors (VCF) for converting observed fuel density at any temperature to standard density at 15°C.

**Formula**: `Standard Density = Observed Density × VCF`

### 2. **Interpolation Method**
When the exact temperature or density isn't in the table, the app uses linear interpolation between the nearest values for maximum accuracy.

### 3. **Thermal Expansion Approximation (Fallback)**
For values outside the table range, the app falls back to thermal expansion coefficient calculations:
- **Petrol**: α = 0.001 per °C
- **Diesel**: α = 0.0008 per °C

**Formula**: `VCF = exp(-α × (T - 15))`

## Supported Fuel Types

| Fuel Type | Density Range (kg/m³) | Temperature Range (°C) | Typical Use |
|-----------|----------------------|------------------------|-------------|
| **Petrol** | 700-850 | -10 to 60 | Gasoline stations |
| **Diesel** | 800-900 | -10 to 60 | Truck stops, industrial |
| **Kerosene** | 750-800 | -10 to 60 | Aviation, heating |
| **Aviation Fuel** | 750-800 | -10 to 60 | Airports, aviation |
| **Biodiesel** | 850-900 | -10 to 60 | Renewable fuel stations |

## Usage Instructions

### **Step 1: Select Fuel Type**
Choose the appropriate fuel type from the dropdown menu. This determines which ASTM table section to use.

### **Step 2: Enter Temperature**
Input the observed temperature in Celsius. The app will show the valid range for your fuel type.

### **Step 3: Enter Observed Density**
Input the density measured at the observed temperature in kg/m³.

### **Step 4: Calculate**
Click "Convert" to get the standard density at 15°C.

### **Step 5: Review Results**
The app displays:
- **Standard Density**: The converted density at 15°C
- **Method Used**: How the calculation was performed
- **Accuracy Level**: Exact, interpolated, or approximate
- **Correction Factor**: The VCF used in the calculation

## Technical Details

### **ASTM 53 B Table Structure**
The table is stored as JSON with the following structure:
```json
{
  "fuelType": {
    "densityRanges": [
      {
        "min": 700,
        "max": 750,
        "factors": {
          "-10": 1.0234,
          "15": 1.0000,
          "60": 0.9595
        }
      }
    ]
  }
}
```

### **Interpolation Algorithm**
1. Find the density range containing the observed density
2. Locate the two closest temperatures in the table
3. Use linear interpolation: `VCF = VCF₁ + (VCF₂ - VCF₁) × (T - T₁) / (T₂ - T₁)`

### **Accuracy Levels**
- **Exact**: Direct table lookup (highest accuracy)
- **Interpolated**: Linear interpolation between table values (high accuracy)
- **Approximate**: Thermal expansion calculation (moderate accuracy)

## Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- Ionic CLI
- Angular CLI

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd fuel-density-converter

# Install dependencies
npm install

# Run the development server
ionic serve
```

### **Building for Production**
```bash
# Build for web
ionic build

# Build for mobile
ionic capacitor build android
ionic capacitor build ios
```

## File Structure

```
src/
├── app/
│   ├── home/
│   │   ├── home.page.ts          # Main component logic
│   │   ├── home.page.html        # User interface
│   │   └── home.page.scss        # Styling
│   ├── services/
│   │   └── astm-table.service.ts # ASTM table handling
│   └── app.module.ts
├── assets/
│   └── astm-53b-table.json      # ASTM table data
└── main.ts
```

## Customization

### **Adding New Fuel Types**
1. Add the fuel type data to `astm-53b-table.json`
2. Include density ranges and temperature factors
3. The app will automatically detect and support the new fuel type

### **Modifying Temperature Ranges**
Update the factors object in the JSON file to include additional temperature points. The interpolation will automatically handle intermediate values.

### **Styling Changes**
Modify `home.page.scss` to customize the appearance and layout of the interface.

## Compliance & Standards

- **ASTM D1250**: Standard Guide for Use of the Petroleum Measurement Tables
- **ISO 12185**: Crude petroleum and petroleum products - Determination of density
- **API MPMS Chapter 11**: Physical Properties Data

## Support & Maintenance

### **Regular Updates**
- Keep the ASTM table data current with latest standards
- Monitor for new fuel types and specifications
- Update interpolation algorithms as needed

### **Validation**
- Cross-reference calculations with official ASTM publications
- Verify results against certified measurement equipment
- Maintain audit trail of calculation methods used

## License

This application is designed for commercial use in petrol pumps and fuel distribution facilities. Please ensure compliance with local regulations and standards.

---

**Note**: This application replaces physical ASTM 53 B tables with a digital, accurate, and user-friendly solution for fuel density conversions. Always verify critical measurements with certified equipment and maintain proper calibration procedures.
