import React from "react";

const steps = [
  { label: "Accommodation", isActive: false },
  { label: "Extra Services", isActive: false },
  { label: "Confirm Booking", isActive: false },
];

const BookingSteps = ({ currentStep, onStepChange }) => {
  return (
    <nav className="w-full flex items-center justify-center mt-8 gap-4 mb-8">
      {steps.map((step, index) => (
        <>
          <div
            key={index}
            className={`flex cursor-pointer transition duration-300 ${
              currentStep === index
                ? "bg-primary text-white font-bold rounded"
                : "text-gray-500"
            }`}
            onClick={() => onStepChange(index)}
          >
            <span
              className={`flex items-center py-2 px-4 rounded ${
                currentStep === index
                  ? "bg-primary border-b-2 border-white rounded"
                  : "hover:bg-[rgb(242,153,0)] hover:text-white rounded"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <span className="mx-2 text-gray-400">{"→"}</span>
          )}
        </>
      ))}
    </nav>
  );
};

export default BookingSteps;
