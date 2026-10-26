import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string;
  className?: string;
}

export function BrandLogo({
  size = "md",
  showText = true,
  href = "/",
  className,
}: BrandLogoProps) {
  const iconDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  }[size];

  const titleSizes = {
    sm: "text-sm",
    md: "text-base sm:text-lg",
    lg: "text-xl sm:text-2xl",
  }[size];

  const subSizes = {
    sm: "text-[8px]",
    md: "text-[9px] sm:text-[10px]",
    lg: "text-[11px]",
  }[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      {/* Bespoke Molar + Metric Geometry */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-500/30 shadow-md shadow-amber-500/10 group-hover:border-amber-400/60 group-hover:shadow-amber-500/20 transition-all flex-shrink-0",
          iconDimensions
        )}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          <defs>
            <linearGradient id="mmToothGrad" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="1" stopColor="#D97706" />
            </linearGradient>
            <linearGradient id="mmMetricGrad" x1="10" y1="18" x2="22" y2="9" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" />
              <stop offset="1" stopColor="#FBBF24" />
            </linearGradient>
          </defs>

          {/* Molar Tooth Contour */}
          <path
            d="M8.5 8.5C8.5 5.8 11.2 4.5 13.8 5.2C15.2 5.6 16.8 5.6 18.2 5.2C20.8 4.5 23.5 5.8 23.5 8.5C23.5 12.8 22.2 16.5 20.8 20.2C19.7 23.2 18.1 26.5 16 26.5C13.9 26.5 12.3 23.2 11.2 20.2C9.8 16.5 8.5 12.8 8.5 8.5Z"
            stroke="url(#mmToothGrad)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="url(#mmToothGrad)"
            fillOpacity="0.12"
          />

          {/* Clinical Metric Trajectory Spark */}
          <path
            d="M11.5 16.5L14.2 13.5L17.2 17L20.8 10.5"
            stroke="url(#mmMetricGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Peak Metric Indicator Node */}
          <circle cx="20.8" cy="10.5" r="1.3" fill="#34D399" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={cn(
              "font-extrabold tracking-tight text-white leading-tight flex items-center gap-0.5",
              titleSizes
            )}
          >
            Molar<span className="text-amber-400">Metric</span>
          </span>
          <span
            className={cn(
              "font-mono font-semibold uppercase tracking-widest text-amber-400/90 leading-none mt-0.5",
              subSizes
            )}
          >
            Dental Revenue OS
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
