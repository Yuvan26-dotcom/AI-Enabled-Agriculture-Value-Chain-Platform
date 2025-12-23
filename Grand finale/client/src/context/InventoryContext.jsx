import React, { createContext, useState, useContext } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  // Mock Inventory Data - Initialized from LocalStorage if available
  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('inventory');
      return saved ? JSON.parse(saved) : [
        { id: 1, crop: 'Soybean', total: 100, locked: 0, available: 100, loanId: null, futureHarvestLien: false, lienHolder: null, encumberedValue: 0, verificationStatus: 'VERIFIED_eNWR' },
        { id: 2, crop: 'Mustard', total: 50, locked: 0, available: 50, loanId: null, futureHarvestLien: false, lienHolder: null, encumberedValue: 0, verificationStatus: 'PENDING_PHYSICAL' },
        { id: 3, crop: 'Wheat', total: 100, locked: 0, available: 100, loanId: null, futureHarvestLien: false, lienHolder: null, encumberedValue: 0, verificationStatus: 'DECLARED_ONLY' },
      ];
    } catch (e) {
      console.error("Failed to parse inventory from localStorage", e);
      return [
        { id: 1, crop: 'Soybean', total: 100, locked: 0, available: 100, loanId: null, futureHarvestLien: false, lienHolder: null, encumberedValue: 0, verificationStatus: 'VERIFIED_eNWR' },
        { id: 2, crop: 'Mustard', total: 50, locked: 0, available: 50, loanId: null, futureHarvestLien: false, lienHolder: null, encumberedValue: 0, verificationStatus: 'PENDING_PHYSICAL' },
        { id: 3, crop: 'Wheat', total: 100, locked: 0, available: 100, loanId: null, futureHarvestLien: false, lienHolder: null, encumberedValue: 0, verificationStatus: 'DECLARED_ONLY' },
      ];
    }
  });

  // Mock Active Loans Database (Simulating Credit Bureau / Bank Records)
  const [activeLoans, setActiveLoans] = useState([
    { 
      id: 'KCC-101', 
      type: 'KCC', 
      landId: 'L-101', 
      amount: 50000, 
      bank: 'SBI KCC Branch',
      startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 days ago
      interestRate: 7.0 // 7% p.a.
    }
  ]);

  // e-RUPI Wallet State
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const creditWallet = (amount, description) => {
    setWalletBalance(prev => prev + amount);
    setTransactions(prev => [{
      id: Date.now(),
      type: 'CREDIT',
      amount,
      description,
      date: new Date().toISOString()
    }, ...prev]);
  };

  const debitWallet = (amount, description) => {
    if (walletBalance < amount) {
      return false; // Insufficient funds
    }
    setWalletBalance(prev => prev - amount);
    setTransactions(prev => [{
      id: Date.now(),
      type: 'DEBIT',
      amount,
      description,
      date: new Date().toISOString()
    }, ...prev]);
    return true;
  };

  // Persist to LocalStorage whenever inventory changes
  React.useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Persist Wallet State
  React.useEffect(() => {
    const savedWallet = localStorage.getItem('walletBalance');
    const savedTx = localStorage.getItem('transactions');
    if (savedWallet) setWalletBalance(parseFloat(savedWallet));
    if (savedTx) setTransactions(JSON.parse(savedTx));
  }, []);

  React.useEffect(() => {
    localStorage.setItem('walletBalance', walletBalance.toString());
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [walletBalance, transactions]);

  // Mock Land Registry (Verified by Satellite/AgriStack)
  const landRegistry = {
    'L-101': { area: 2.0, owner: 'Farmer A' }, // 2 Acres
    'L-102': { area: 5.0, owner: 'Farmer A' }, // 5 Acres
    'L-103': { area: 1.5, owner: 'Farmer A' }  // 1.5 Acres
  };

  // Biological Max Yield Map (Quintals per Acre)
  const averageYieldMap = {
    'Soybean': 10,
    'Mustard': 12,
    'Wheat': 18,
    'Groundnut': 15,
    'Castor': 8
  };

  const declareHarvest = (landId, cropName, quantity, seedVariety = 'Traditional') => {
    // 1. AI-Yield Validation Logic
    const landInfo = landRegistry[landId];
    const avgYield = averageYieldMap[cropName] || 10; // Default to 10 if unknown
    
    if (!landInfo) {
      alert("Error: Invalid Land ID. Please verify your land records.");
      return;
    }

    let maxLimit = landInfo.area * avgYield * 1.25; // Base Limit + 25% Buffer
    
    // Advanced Yield Capping: Hybrid Seed Bonus
    if (seedVariety === 'Hybrid') {
      maxLimit = landInfo.area * avgYield * 1.30; // 30% Bonus for Hybrid/HYV
    }

    const qty = parseFloat(quantity);

    if (qty > maxLimit) {
      alert(
        `🚫 YIELD FRAUD ALERT\n\n` +
        `Declared Quantity (${qty} Q) exceeds the Biological Max Potential for this land.\n` +
        `Seed Variety: ${seedVariety}\n` +
        `Max Allowed: ${maxLimit.toFixed(2)} Q.\n\n` +
        `Action Blocked: Please contact FPO for physical verification if this yield is genuine.`
      );
      return; // REJECT THE TRANSACTION
    }

    // 2. Check for active KCC loan on this land
    const kccLoan = activeLoans.find(l => l.landId === landId && l.type === 'KCC');

    setInventory(prev => {
      const existingItem = prev.find(i => i.crop === cropName);
      
      if (existingItem) {
        // If item exists, update it
        // If KCC loan exists, we inherit the lien. 
        // Note: In a real app, we'd handle multiple loans/liens more complexly.
        const newEncumberedValue = kccLoan ? (existingItem.encumberedValue + kccLoan.amount) : existingItem.encumberedValue;
        const newLienHolder = kccLoan ? kccLoan.bank : existingItem.lienHolder;

        return prev.map(item => 
          item.crop === cropName 
            ? { 
                ...item, 
                total: item.total + qty, 
                available: item.available + qty,
                lienHolder: newLienHolder,
                encumberedValue: newEncumberedValue
              } 
            : item
        );
      } else {
        // New crop entry
        return [...prev, {
          id: Date.now(),
          crop: cropName,
          total: qty,
          locked: 0,
          available: qty,
          loanId: null,
          futureHarvestLien: false,
          lienHolder: kccLoan ? kccLoan.bank : null,
          encumberedValue: kccLoan ? kccLoan.amount : 0,
          verificationStatus: 'PENDING'
        }];
      }
    });

    if (kccLoan) {
      alert(`Harvest Declared! \n\n⚠️ ALERT: Active KCC Loan detected on Land ${landId}.\nLien marked for ${kccLoan.bank} (₹${kccLoan.amount.toLocaleString()}).\n\nThis amount will be deducted automatically upon sale.`);
    } else {
      alert('Harvest Declared Successfully!');
    }
  };

  const pledgeCrop = (cropName, loanId, pledgeAmount, loanType = 'Warehouse') => {
    setInventory(prev => prev.map(item => {
      if (item.crop === cropName) {
        if (loanType === 'Warehouse') {
          // Type A: Warehouse Loan (Hard Lock)
          const amountToLock = parseFloat(pledgeAmount);
          if (item.available < amountToLock) {
            alert(`Insufficient available inventory. Available: ${item.available}, Required: ${amountToLock}`);
            return item;
          }
          return {
            ...item,
            locked: item.locked + amountToLock,
            available: item.available - amountToLock,
            loanId
          };
        } else if (loanType === 'KCC') {
          // Type B: KCC (Future Harvest Lien)
          // Do NOT lock current inventory. Set a flag.
          return {
            ...item,
            futureHarvestLien: true,
            loanId
          };
        }
      }
      return item;
    }));
  };

  const updateStock = (cropName, newTotal) => {
    setInventory(prev => prev.map(item => 
      item.crop === cropName 
        ? { ...item, total: newTotal, available: newTotal - item.locked } 
        : item
    ));
  };

  const getStock = (cropName) => {
    return inventory.find(item => item.crop === cropName);
  };

  const getActiveLoan = (landId) => {
    return activeLoans.find(l => l.landId === landId);
  };

  const repayLoan = (landId, amount) => {
    // Mock Repayment Logic
    setActiveLoans(prevLoans => {
      const updatedLoans = prevLoans.map(loan => {
        if (loan.landId === landId) {
          const newAmount = Math.max(0, loan.amount - amount);
          return { ...loan, amount: newAmount };
        }
        return loan;
      });

      // Check if loan is closed (amount is 0)
      const loan = updatedLoans.find(l => l.landId === landId);
      if (loan && loan.amount === 0) {
        // Clear liens on inventory
        setInventory(prevInv => prevInv.map(item => {
          if (item.lienHolder === loan.bank) {
            return { ...item, lienHolder: null, encumberedValue: 0 };
          }
          return item;
        }));
        alert(`Loan Closed Successfully! \n\nAll liens on Land ${landId} have been removed.`);
        
        // Filter out the closed loan
        return updatedLoans.filter(l => l.landId !== landId);
      } else {
        alert(`Repayment Successful! \n\nNew Outstanding Balance: ₹${loan.amount.toLocaleString()}`);
        return updatedLoans;
      }
    });
  };

  return (
    <InventoryContext.Provider value={{ 
      inventory, 
      pledgeCrop, 
      updateStock, 
      getStock, 
      declareHarvest, 
      getActiveLoan, 
      repayLoan, 
      walletBalance, 
      creditWallet, 
      debitWallet,
      transactions 
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
