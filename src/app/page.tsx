'use client';

import { useState } from 'react';
import StepsIndicator from '@/components/StepsIndicator';
import ExchangeForm from '@/components/ExchangeForm';
import PersonalInfoForm from '@/components/PersonalInfoForm';
import WalletInfo from '@/components/WalletInfo';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  accountType?: string;
  accountNumber?: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState('NEQUI');
  const [amount, setAmount] = useState(0);
  const [wldAmount, setWldAmount] = useState('');
  const [formData, setFormData] = useState<FormData | undefined>();

  const handleContinue = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleHome = () => {
    setCurrentStep(1);
    setAmount(0);
    setSelectedBank('NEQUI');
    setWldAmount('');
    setFormData(undefined);
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    handleContinue();
  };

  return (
    <div className="app-container">
      <main>
        <StepsIndicator currentStep={currentStep} />
        
        {currentStep === 1 && (
          <ExchangeForm
            onContinue={handleContinue}
            onAmountChange={setAmount}
            onBankChange={setSelectedBank}
            onWldAmountChange={setWldAmount}
          />
        )}
        
        {currentStep === 2 && (
          <PersonalInfoForm
            selectedBank={selectedBank}
            onBack={handleBack}
            onContinue={handleFormSubmit}
          />
        )}
        
        {currentStep === 3 && (
          <WalletInfo
            amount={amount}
            onHome={handleHome}
            formData={formData}
            selectedBank={selectedBank}
            wldAmount={wldAmount}
          />
        )}
      </main>
    </div>
  );
}
