/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

interface ApinLogoProps {
  variant?: 'header' | 'hero' | 'footer';
  className?: string;
}

export const ApinLogo: React.FC<ApinLogoProps> = ({ variant = 'header', className = '' }) => {
  const [imageError, setImageError] = useState(false);

  // Height configurations per variant requirement:
  // header: max height ~48px
  // hero: max height ~120px
  // footer: max height ~40px
  const sizeClasses = {
    header: 'h-10 md:h-11 max-h-[48px] w-auto',
    hero: 'h-20 sm:h-24 md:h-28 max-h-[120px] w-auto drop-shadow-sm',
    footer: 'h-9 md:h-10 max-h-[40px] w-auto opacity-95',
  }[variant];

  return (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      {/* ======================================================== */}
      {/* LOGO_SLOT: Exact APIN Logo markup specified by user */}
      {/* ======================================================== */}
      {!imageError ? (
        <a
          href="https://ibb.co/SXbbwZPC"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="APIN Public Health Initiatives Logo"
          className="inline-block transition-transform duration-200 hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[#045877] rounded-md"
        >
          <img
            src="https://i.ibb.co/3y22mP7Z/APIN-Earth-Globe-Logo.png"
            alt="APIN logo"
            className={`${sizeClasses} object-contain border-0`}
            onError={() => setImageError(true)}
          />
        </a>
      ) : (
        /* Fallback text wordmark if external image CDN fails to load */
        <div className="flex items-center gap-2 font-bold tracking-tight text-[#045877]">
          <div className="w-8 h-8 rounded-full border-2 border-[#83D806] flex items-center justify-center bg-[#F5FAFB]">
            <span className="text-xs text-[#045877] font-black">A</span>
          </div>
          <span className={variant === 'hero' ? 'text-3xl font-extrabold tracking-wider' : 'text-xl font-extrabold tracking-wider'}>
            APIN
          </span>
        </div>
      )}
      {/* ======================================================== */}
      {/* END LOGO_SLOT */}
      {/* ======================================================== */}
    </div>
  );
};
