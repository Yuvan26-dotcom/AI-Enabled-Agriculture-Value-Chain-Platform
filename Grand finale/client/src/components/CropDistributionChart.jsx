import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DISTRICT_CROP_MAPPING } from '../data/district_crops';
import { ALL_OILSEEDS } from './DashboardHeader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c', '#d0ed57'];

const CropDistributionChart = ({ selectedState, selectedDistrict }) => {
  
  const getData = () => {
    let crops = [];
    
    // Determine which crops to show based on selection
    if (selectedDistrict && selectedDistrict !== 'All' && DISTRICT_CROP_MAPPING[selectedDistrict]) {
      crops = DISTRICT_CROP_MAPPING[selectedDistrict];
    } else {
      // Fallback default: Use a subset of ALL_OILSEEDS or random ones for visualization if state map is missing
      // Since STATE_CROP_MAP was removed, we'll just pick top 4 from ALL_OILSEEDS for now
      crops = ALL_OILSEEDS.slice(0, 4);
    }

    // Generate mock values for the crops
    const seedStr = (selectedDistrict || selectedState || 'default');
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
      seed += seedStr.charCodeAt(i);
    }

    const data = crops.map((crop, index) => {
      // Pseudo-random value generation
      const value = (seed * (index + 1) * 9301 + 49297) % 60 + 20; 
      return { name: crop, value };
    });

    return data;
  };

  const data = getData();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h3 className="text-lg font-bold text-gray-700 mb-4">
        Crop Distribution - {selectedDistrict !== 'All' ? selectedDistrict : selectedState}
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CropDistributionChart;
