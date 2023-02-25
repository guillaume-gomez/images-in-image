import React from 'react';

interface StepFormCardProps {
  children: React.ReactNode;
  stepNumber: number;
  title: string;
  nextButtonText: string;
}

function StepFormCard({children, stepNumber, title, nextButtonText} : StepFormCardProps) {
  return (
    <div className="card card-side bg-base-100 shadow-xl">

          <div className="badge badge-lg">{stepNumber}</div>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
        <div className="card-actions justify-end">
          <button className="btn btn-primary">{nextButtonText}</button>
        </div>
      </div>
    </div>
  );
}

export default StepFormCard;
