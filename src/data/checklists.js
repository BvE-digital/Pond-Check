export const CHECKLISTS = [
  {
    id: 'water-quality-basic',
    name: 'Water Quality - Basic',
    description: 'Core water parameters for daily monitoring',
    icon: 'Droplets',
    enabled: false,
    fields: [
      { key: 'pond_id', label: 'Pond ID', type: 'text', required: true, placeholder: 'e.g. E-14' },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'time', label: 'Time', type: 'time', required: true },
      // Warning if outside 20–35°C; stress below 20, critical above 33
      { key: 'temperature', label: 'Temperature', type: 'number', unit: '°C', min: 20, max: 35, required: true },
      // Warning if below 4 mg/L (stress) or above 15 (unusual supersaturation)
      { key: 'dissolved_oxygen', label: 'Dissolved Oxygen', type: 'number', unit: 'mg/L', min: 4, max: 15, required: true },
      // Warning if outside 7.0–9.0 (optimal shrimp range)
      { key: 'ph', label: 'pH', type: 'number', unit: '', min: 7.0, max: 9.0, required: true },
      // Warning if outside 10–35 ppt for marine shrimp
      { key: 'salinity', label: 'Salinity', type: 'number', unit: 'ppt', min: 10, max: 35, required: true },
      // Warning if outside 20–60 cm; very low = turbid/bloom, very high = clear/understocked
      { key: 'secchi_depth', label: 'Secchi Depth (Transparency)', type: 'number', unit: 'cm', min: 20, max: 60, required: true },
    ],
  },
  {
    id: 'water-quality-advanced',
    name: 'Water Quality - Advanced',
    description: 'Chemical parameters for in-depth water analysis',
    icon: 'FlaskConical',
    enabled: true,
    fields: [
      { key: 'pond_id', label: 'Pond ID', type: 'text', required: true, placeholder: 'e.g. E-14' },
      { key: 'date', label: 'Date', type: 'date', required: true },
      // Warning if >0.1 mg/L; toxic above 0.3 mg/L especially at high pH
      { key: 'ammonia', label: 'Ammonia (NH₃)', type: 'number', unit: 'mg/L', min: 0, max: 0.1, required: true },
      // Warning if >0.1 mg/L; acutely toxic to shrimp
      { key: 'nitrite', label: 'Nitrite (NO₂)', type: 'number', unit: 'mg/L', min: 0, max: 0.1, required: true },
      // Warning if >50 mg/L; generally less toxic but indicates nutrient load
      { key: 'nitrate', label: 'Nitrate (NO₃)', type: 'number', unit: 'mg/L', min: 0, max: 50, required: true },
      // Warning if outside 80–200 mg/L CaCO3; below 80 = unstable pH buffering
      { key: 'alkalinity', label: 'Alkalinity', type: 'number', unit: 'mg/L CaCO₃', min: 80, max: 200, required: true },
      // Warning if outside 50–300 mg/L
      { key: 'hardness', label: 'Hardness', type: 'number', unit: 'mg/L', min: 50, max: 300, required: true },
      // Warning if >0.01 mg/L; toxic at very low concentrations
      { key: 'hydrogen_sulphide', label: 'Hydrogen Sulphide (H₂S)', type: 'number', unit: 'mg/L', min: 0, max: 0.01, required: true },
    ],
  },
  {
    id: 'algae-plankton',
    name: 'Algae & Plankton Assessment',
    description: 'Bloom status, algae species and plankton density',
    icon: 'Microscope',
    enabled: false,
    fields: [
      { key: 'pond_id', label: 'Pond ID', type: 'text', required: true, placeholder: 'e.g. E-14' },
      { key: 'date', label: 'Date', type: 'date', required: true },
      {
        key: 'dominant_algae',
        label: 'Dominant Algae Species',
        type: 'select',
        required: true,
        options: ['Chaetoceros', 'Skeletonema', 'Thalassiosira', 'Chlorella', 'Oscillatoria', 'Microcystis', 'Mixed', 'Other'],
      },
      // Warning if outside 50,000–1,000,000 cells/mL; bloom >500k, crash risk >2M
      { key: 'algae_density', label: 'Algae Density', type: 'number', unit: 'cells/mL', min: 50000, max: 1000000, required: true },
      {
        key: 'water_colour',
        label: 'Water Colour',
        type: 'select',
        required: true,
        options: ['Green', 'Brown', 'Yellow-green', 'Blue-green', 'Dark green', 'Clear', 'Turbid'],
      },
      {
        key: 'bloom_status',
        label: 'Bloom Status',
        type: 'select',
        required: true,
        options: ['Absent', 'Developing', 'Stable', 'Declining', 'Crash'],
      },
      {
        key: 'zooplankton',
        label: 'Zooplankton Presence',
        type: 'select',
        required: true,
        options: ['Abundant', 'Moderate', 'Low', 'Absent'],
      },
    ],
  },
  {
    id: 'shrimp-health',
    name: 'Shrimp Health Check',
    description: 'Physical condition and survival assessment',
    icon: 'Activity',
    enabled: false,
    fields: [
      { key: 'pond_id', label: 'Pond ID', type: 'text', required: true, placeholder: 'e.g. E-14' },
      { key: 'date', label: 'Date', type: 'date', required: true },
      // Warning if sample < 30 (statistically insufficient)
      { key: 'sample_size', label: 'Sample Size', type: 'number', unit: 'shrimp', min: 30, max: 500, required: true },
      // Warning if outside 0.5–40g; depends on DOC
      { key: 'avg_body_weight', label: 'Average Body Weight', type: 'number', unit: 'g', min: 0.5, max: 40, required: true },
      // Warning if below 60% (economically concerning) or suspiciously high >95%
      { key: 'survival_pct', label: 'Estimated Survival', type: 'number', unit: '%', min: 60, max: 95, required: true },
      {
        key: 'gut_fullness',
        label: 'Gut Fullness',
        type: 'select',
        required: true,
        options: ['Full', '3/4', '1/2', '1/4', 'Empty'],
      },
      {
        key: 'body_colour',
        label: 'Body Colour',
        type: 'select',
        required: true,
        options: ['Normal', 'Pale', 'Dark', 'Red', 'Blue'],
      },
      {
        key: 'antenna_condition',
        label: 'Antenna Condition',
        type: 'select',
        required: true,
        options: ['Intact', 'Broken', 'Missing tips'],
      },
      {
        key: 'gill_condition',
        label: 'Gill Condition',
        type: 'select',
        required: true,
        options: ['Clean', 'Slightly fouled', 'Heavily fouled', 'Black'],
      },
    ],
  },
  {
    id: 'feed-management',
    name: 'Feed Management',
    description: 'Feed consumption, FCR and adjustment recommendations',
    icon: 'Package',
    enabled: false,
    fields: [
      { key: 'pond_id', label: 'Pond ID', type: 'text', required: true, placeholder: 'e.g. E-14' },
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'feed_type', label: 'Feed Type / Brand', type: 'text', required: true, placeholder: 'e.g. Skretting HP Pro 2' },
      // Warning if daily feed >5% of estimated biomass (overfeeding risk)
      { key: 'daily_feed_kg', label: 'Daily Feed Amount', type: 'number', unit: 'kg', min: 0.1, max: 5000, required: true },
      // Warning if outside 2–4 feeds/day
      { key: 'feeding_frequency', label: 'Feeding Frequency', type: 'number', unit: 'per day', min: 2, max: 4, required: true },
      // Warning if FCR >1.8 (overfeeding or health issue) or <0.8 (unusually efficient)
      { key: 'fcr_estimate', label: 'Feed Conversion Ratio (FCR)', type: 'number', unit: '', min: 0.8, max: 1.8, required: true },
      {
        key: 'feed_tray_observation',
        label: 'Feed Tray Observation',
        type: 'select',
        required: true,
        options: ['Empty within 2h', 'Some remaining', 'Mostly remaining', 'Untouched'],
      },
      {
        key: 'adjustment_recommendation',
        label: 'Adjustment Recommendation',
        type: 'select',
        required: true,
        options: ['Increase 10%', 'Maintain', 'Decrease 10%', 'Decrease 20%', 'Stop feeding'],
      },
    ],
  },
  {
    id: 'pond-infrastructure',
    name: 'Pond Infrastructure',
    description: 'Aerators, water lines, bank and screen condition',
    icon: 'Wrench',
    enabled: false,
    fields: [
      { key: 'pond_id', label: 'Pond ID', type: 'text', required: true, placeholder: 'e.g. E-14' },
      { key: 'date', label: 'Date', type: 'date', required: true },
      {
        key: 'aerator_status',
        label: 'Aerator Status',
        type: 'select',
        required: true,
        options: ['All operational', 'Partial failure', 'Major failure'],
      },
      // Warning if <2 (insufficient aeration for stocked density)
      { key: 'aerators_operational', label: 'Aerators Operational', type: 'number', unit: 'units', min: 2, max: 30, required: true },
      {
        key: 'inlet_condition',
        label: 'Water Inlet Condition',
        type: 'select',
        required: true,
        options: ['Good', 'Partial blockage', 'Blocked', 'Damaged'],
      },
      {
        key: 'outlet_condition',
        label: 'Water Outlet Condition',
        type: 'select',
        required: true,
        options: ['Good', 'Partial blockage', 'Blocked', 'Damaged'],
      },
      {
        key: 'bank_condition',
        label: 'Pond Bank Condition',
        type: 'select',
        required: true,
        options: ['Intact', 'Minor erosion', 'Significant erosion', 'Breach risk'],
      },
      {
        key: 'screen_condition',
        label: 'Screen / Net Condition',
        type: 'select',
        required: true,
        options: ['Intact', 'Minor damage', 'Needs replacement'],
      },
    ],
  },
  {
    id: 'mortality-disease',
    name: 'Mortality & Disease Observation',
    description: 'Daily mortality count, patterns and clinical signs',
    icon: 'AlertTriangle',
    enabled: false,
    fields: [
      { key: 'pond_id', label: 'Pond ID', type: 'text', required: true, placeholder: 'e.g. E-14' },
      { key: 'date', label: 'Date', type: 'date', required: true },
      // Warning if >50/day (concerning) or >500/day (critical)
      { key: 'daily_mortality', label: 'Estimated Daily Mortality', type: 'number', unit: 'shrimp', min: 0, max: 50, required: true },
      {
        key: 'mortality_pattern',
        label: 'Mortality Pattern',
        type: 'select',
        required: true,
        options: ['Scattered', 'Near aerators', 'Near inlet', 'At surface', 'At bottom', 'Along banks'],
      },
      {
        key: 'observed_symptoms',
        label: 'Observed Symptoms',
        type: 'multiselect',
        required: true,
        options: ['Lethargy', 'Erratic swimming', 'Surface crawling', 'Loose shell', 'White spots', 'Black spots', 'Red colouration', 'Soft shell', 'Luminescence', 'None'],
      },
      {
        key: 'moribund_observed',
        label: 'Moribund Shrimp Observed',
        type: 'select',
        required: true,
        options: ['Yes', 'No'],
      },
      {
        key: 'sample_collected',
        label: 'Sample Collected for Lab',
        type: 'select',
        required: true,
        options: ['Yes', 'No', 'Not needed'],
      },
    ],
  },
  {
    id: 'harvest-readiness',
    name: 'Harvest Readiness Assessment',
    description: 'Biomass estimate and harvest timing recommendation',
    icon: 'Scale',
    enabled: false,
    fields: [
      { key: 'pond_id', label: 'Pond ID', type: 'text', required: true, placeholder: 'e.g. E-14' },
      { key: 'date', label: 'Date', type: 'date', required: true },
      // Warning if DOC <60 (too early) or >150 (overdue, quality risk)
      { key: 'days_of_culture', label: 'Days of Culture (DOC)', type: 'number', unit: 'days', min: 60, max: 150, required: true },
      // Warning if outside 12–35g (below target or overgrown)
      { key: 'avg_body_weight', label: 'Average Body Weight', type: 'number', unit: 'g', min: 12, max: 35, required: true },
      // Warning if outside 15–40g target range
      { key: 'target_harvest_weight', label: 'Target Harvest Weight', type: 'number', unit: 'g', min: 15, max: 40, required: true },
      // Warning if outside 500–20,000 kg (very low or very high for a single pond)
      { key: 'estimated_biomass', label: 'Estimated Biomass', type: 'number', unit: 'kg', min: 500, max: 20000, required: true },
      // Warning if below 60% (economically marginal)
      { key: 'survival_pct', label: 'Estimated Survival', type: 'number', unit: '%', min: 60, max: 95, required: true },
      { key: 'market_price', label: 'Market Price', type: 'number', unit: 'local/kg', min: 1, max: 99999, required: true },
      {
        key: 'recommendation',
        label: 'Harvest Recommendation',
        type: 'select',
        required: true,
        options: ['Harvest now', 'Wait 1 week', 'Wait 2 weeks', 'Requires review'],
      },
    ],
  },
];
