interface StepsIndicatorProps {
  currentStep: number;
}

export default function StepsIndicator({ currentStep }: StepsIndicatorProps) {
  return (
    <div className="steps-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
      <div className="step-line"></div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
    </div>
  );
}
