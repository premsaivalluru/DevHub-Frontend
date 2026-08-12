import React from 'react';

export default function StatCard({ icon: Icon, count, label, showDivider = true, iconColor = "text-sky-500" }) {
  return (
    /* Added overflow-hidden to stop adjacent grid column elements from masking the line */
    <div className={`flex flex-col gap-4 justify-center items-center w-full relative overflow-hidden
      ${showDivider ? 'md:after:absolute md:after:right-0 md:after:top-1/2.5 md:after:h-3/4 md:after:w-[1px] md:after:bg-gray-700 md:after:z-50' : ''}`}>
      
      {/* Dynamic Icon */}
      {Icon && <Icon size={30} className={iconColor} />}
      
      {/* Numeric Count */}
      <span className="text-2xl font-bold text-white">{count}</span>
      
      {/* Label */}
      <span className="font-light text-xs text-gray-400 text-center">{label}</span>
    </div>
  );
}
