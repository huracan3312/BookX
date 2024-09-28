import { useState } from "react";
import BookingSteps from "./BookingSteps.jsx";
import ConfirmationForm from "./ConfirmationForm.jsx";

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(2);
  const handleStepChange = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <div>Content for Accommodation</div>;
      case 1:
        return <div>Content for Extra Services</div>;
      case 2:
        return (
          <div>
            <ConfirmationForm />
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div>
      <BookingSteps currentStep={currentStep} onStepChange={handleStepChange} />
      {renderStepContent()}
    </div>
  );
}
