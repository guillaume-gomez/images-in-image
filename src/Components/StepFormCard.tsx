import React from 'react';

interface StepFormCardProps {
  children: React.ReactNode;
  stepNumber: number;
  title: string;
  nextButtonText?: string;
  onClick?: () => void;
  id: string;
}

function StepFormCard({ id, children, stepNumber, title, nextButtonText, onClick} : StepFormCardProps) {
  return (
    <div id={id} className="card card-side bg-base-100 shadow-xl">
      <div className="mt-2 ml-2">
        <div className="badge badge-lg">
          {stepNumber}
        </div>
      </div>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {children}
        {
          nextButtonText ?
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={onClick}>{nextButtonText}</button>
          </div> :
          <></>
        }

      </div>
    </div>
  );
}

export default StepFormCard;
