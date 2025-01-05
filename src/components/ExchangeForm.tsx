'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { MIN_WLD, COMMISSION } from '@/lib/constants';

interface ExchangeFormProps {
  onContinue: () => void;
  onAmountChange: (amount: number) => void;
  onBankChange: (bank: string) => void;
  onWldAmountChange: (amount: string) => void;
}

export default function ExchangeForm({ onContinue, onAmountChange, onBankChange, onWldAmountChange }: ExchangeFormProps) {
  const [wldAmount, setWldAmount] = useState<string>('');
  const [copAmount, setCopAmount] = useState<string>('0');
  const [wldPrice, setWldPrice] = useState<number>(0);
  const [usdtCopPrice, setUsdtCopPrice] = useState<number>(4000);
  const [showMinWarning, setShowMinWarning] = useState<boolean>(true);

  useEffect(() => {
    const updatePrices = async () => {
      try {
        const [wldResponse, usdtResponse] = await Promise.all([
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=WLDUSDT'),
          fetch('https://api.binance.com/api/v3/ticker/price?symbol=USDTCOP')
        ]);
        
        const wldData = await wldResponse.json();
        const usdtData = await usdtResponse.json();
        
        setWldPrice(parseFloat(wldData.price));
        setUsdtCopPrice(parseFloat(usdtData.price));
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    updatePrices();
    const interval = setInterval(updatePrices, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleWldChange = (value: string) => {
    setWldAmount(value);
    onWldAmountChange(value);
    const numValue = parseFloat(value) || 0;
    setShowMinWarning(numValue < MIN_WLD);
    
    if (numValue >= MIN_WLD) {
      const usdtAmount = numValue * wldPrice;
      const copValue = Math.floor(usdtAmount * usdtCopPrice - COMMISSION);
      setCopAmount(formatCurrency(copValue));
      onAmountChange(copValue);
    } else {
      setCopAmount('0');
      onAmountChange(0);
    }
  };

  const bankOptions = [
    { value: 'NEQUI', label: 'NEQUI' },
    { value: 'DAVIPLATA', label: 'DAVIPLATA' },
    { value: 'BANCOLOMBIA', label: 'BANCOLOMBIA' },
    { value: 'BANCO DAVIVIENDA', label: 'BANCO DAVIVIENDA' }
  ];

  return (
    <section id="step1" className="step-content active">
      <h2>Intercambio de WorldCoin</h2>
      <div className="exchange-container">
        <div className="exchange-section">
          <h3>ENVÍAS</h3>
          <div className="currency-input">
            <Image src="/assets/wld.png" alt="WLD" width={30} height={30} className="currency-icon" />
            <input
              type="number"
              value={wldAmount}
              onChange={(e) => handleWldChange(e.target.value)}
              min={MIN_WLD}
              placeholder="0"
            />
          </div>
        </div>

        <div className="exchange-section">
          <h3>RECIBES</h3>
          <div className="currency-input">
            <Image src="/assets/COL.png" alt="COP" width={30} height={30} className="currency-icon" />
            <span>{copAmount}</span>
          </div>
        </div>

        <p className={`min-amount-warning ${!showMinWarning ? 'hidden' : ''}`}>
          El monto mínimo de intercambio es de {MIN_WLD} WorldCoin
        </p>

        <div className="bank-selection">
          <h3>Método de consignación</h3>
          <select onChange={(e) => onBankChange(e.target.value)}>
            {bankOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
      <button 
        className={`continue-btn-full ${(!wldAmount || parseFloat(wldAmount) < MIN_WLD) ? 'disabled' : ''}`}
        onClick={onContinue}
        disabled={!wldAmount || parseFloat(wldAmount) < MIN_WLD}
      >
        CONTINUAR
      </button>
    </section>
  );
}
