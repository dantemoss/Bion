"use client"

import React, { ComponentPropsWithoutRef } from "react"

import { cn } from "@/lib/utils"

interface SpinningTextProps extends ComponentPropsWithoutRef<"div"> {
  children: string | string[]
  duration?: number
  reverse?: boolean
  radius?: number
  transition?: { duration?: number }
  variants?: Record<string, unknown>
}

/** Separa por " • " para que cada palabra/frase sea un bloque legible en el círculo */
function getSegments(text: string): string[] {
  const segments = text.split(/\s*•\s*/).filter(Boolean)
  return segments.length > 0 ? segments : [text]
}

export function SpinningText({
  children,
  duration = 10,
  reverse = false,
  radius = 5,
  transition,
  className,
  style,
  ...props
}: SpinningTextProps) {
  const raw =
    typeof children === "string"
      ? children
      : Array.isArray(children)
        ? children.filter((c) => typeof c === "string").join("")
        : ""

  const segments = getSegments(raw)
  const durationSec = transition?.duration ?? duration

  return (
    <div
      className={cn("relative", className)}
      style={{
        ...style,
        animation: `spin-circle ${durationSec}s linear infinite`,
        animationDirection: reverse ? "reverse" : "normal",
      } as React.CSSProperties}
      {...props}
    >
      {segments.map((segment, index) => {
        const angle = (360 / segments.length) * index
        return (
          <span
            aria-hidden="true"
            key={`${index}-${segment}`}
            className="absolute top-1/2 left-1/2 inline-block origin-center whitespace-nowrap"
            style={{
              "--radius": radius,
              transform: `
                  translate(-50%, -50%)
                  rotate(${angle}deg)
                  translateY(calc(var(--radius, 5) * -1ch))
                `,
              transformOrigin: "center center",
            } as React.CSSProperties}
          >
            <span
              className="inline-block origin-center"
              style={{
                transform: `rotate(${-angle}deg)`,
                transformOrigin: "center center",
              }}
            >
              {segment}
            </span>
          </span>
        )
      })}
      <span className="sr-only">{raw}</span>
    </div>
  )
}
