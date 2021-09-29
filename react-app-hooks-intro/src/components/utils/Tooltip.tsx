import React, { FC, PropsWithChildren } from "react"
import componentStyles from "./Tooltip.module.css"

/**
 * CSS example: https://stackoverflow.com/a/18359711/2085356
 * React example: https://www.30secondsofcode.org/react/s/tooltip
 */
export type TooltipProps = {
  tooltipText: string
}

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({ children, tooltipText }) => {
  return (
    <span className={componentStyles.tooltipContainer}>
      <span className={componentStyles.tooltip}>{tooltipText}</span>
      {children}
    </span>
  )
}
