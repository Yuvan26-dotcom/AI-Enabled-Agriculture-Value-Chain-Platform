import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { ShieldCheck, AlertTriangle, Ban, MapPin } from 'lucide-react';

const PRIORITY_ZONES = [
  "Latur", "Nanded", "Osmanabad", // Maharashtra
  "Adilabad", "Khammam", "Nalgonda", // Telangana
  "Raichur", "Bellary", // Karnataka
  "Indore", "Morena", // MP
  "Bharatpur", "Bikaner" // Rajasthan
];

const CreditLoanWidget = () => {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loanEligibility, setLoanEligibility] = useState(0);
  const [district, setDistrict] = useState("Indore"); // Default to a priority zone
  const [isPriority, setIsPriority] = useState(false);

  useEffect(() => {
    calculateCreditScore();
  }, [district]);

  const calculateCreditScore = () => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      let baseScore = 720;
      let bonus = 0;
      
      // Check if district is in NMEO-OP Priority List
      const isPriorityZone = PRIORITY_ZONES.includes(district);
      setIsPriority(isPriorityZone);

      if (isPriorityZone) {
        bonus = 50; // Significant boost for priority zones
      }

      const finalScore = baseScore + bonus;
      setScore(finalScore);
      calculateLoan(finalScore);
      setLoading(false);
    }, 600);
  };

  const calculateLoan = (currentScore) => {
    // Logic: Score 750 = 5 Lakh. Linear interpolation or tiers.
    let amount = 0;
    if (currentScore >= 750) amount = 500000;
    else if (currentScore >= 600) amount = 300000;
    else if (currentScore >= 450) amount = 100000;
    else amount = 0;
    setLoanEligibility(amount);
  };

  // Gauge Chart Data
  const data = [
    { name: 'Score', value: score, color: '#16a34a' }, // Green
    { name: 'Remaining', value: 850 - score, color: '#e5e7eb' } // Gray
  ];

  const cx = "50%";
  const cy = "70%";
  const iR = 60;
  const oR = 80;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">Farmer Credit Score</h3>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-gray-500" />
          <select 
            value={district} 
            onChange={(e) => setDistrict(e.target.value)}
            className="text-sm border rounded p-1 bg-gray-50"
          >
            <option value="Indore">Indore (MP)</option>
            <option value="Latur">Latur (Mah)</option>
            <option value="Raichur">Raichur (Kar)</option>
            <option value="Pune">Pune (Mah)</option>
            <option value="Bhopal">Bhopal (MP)</option>
            <option value="Mumbai">Mumbai (Mah)</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="h-48 flex items-center justify-center text-gray-400">Calculating...</div>
      ) : (
        <div className="h-48 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                dataKey="value"
                startAngle={180}
                endAngle={0}
                data={data}
                cx={cx}
                cy={cy}
                innerRadius={iR}
                outerRadius={oR}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="text-4xl font-bold text-gray-800">{score}</span>
            <span className="text-sm text-gray-500 block">/ 850</span>
          </div>
        </div>
      )}

      <div className="text-center mt-[-20px] w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          {score >= 750 ? <ShieldCheck className="text-green-600" /> : 
           score >= 600 ? <AlertTriangle className="text-yellow-500" /> : 
           <Ban className="text-red-500" />}
          <span className={`font-medium ${score >= 750 ? 'text-green-600' : score >= 600 ? 'text-yellow-600' : 'text-red-600'}`}>
            {score >= 750 ? 'Excellent' : score >= 600 ? 'Good' : 'High Risk'}
          </span>
        </div>

        {isPriority && (
          <div className="mb-3 bg-green-50 text-green-700 text-xs py-1 px-2 rounded-full inline-block border border-green-200">
            ✨ NMEO-OP Priority Zone Bonus Applied
          </div>
        )}
        
        <div className="bg-blue-50 p-3 rounded-lg w-full">
          <p className="text-xs text-blue-600 uppercase font-bold tracking-wide">Max Loan Eligibility</p>
          <p className="text-2xl font-bold text-blue-800">₹ {(loanEligibility / 100000).toFixed(1)} Lakh</p>
        </div>
      </div>
    </div>
  );
};

export default CreditLoanWidget;