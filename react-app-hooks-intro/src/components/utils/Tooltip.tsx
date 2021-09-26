import React, { FC, PropsWithChildren } from "react"
import componentStyles from "./Tooltip.module.css"

/**
 * CSS example: https://stackoverflow.com/a/18359711/2085356
 * React example: https://www.30secondsofcode.org/react/s/tooltip
 *
 * This component is based on the React example above, which is just a wrapper for the CSS example.
 */
export type TooltipProps = {
  tooltipText: string
}

export const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({ children, tooltipText }) => {
  const [showTooltip, setShowTooltip] = React.useState(false)
  const onMouseEnter = () => setShowTooltip(true)
  const onMouseLeave = () => setShowTooltip(false)

  const styleVisible = componentStyles.tooltip + " " + componentStyles.visible
  const styleInvisible = componentStyles.tooltip

  return (
    <span
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={componentStyles.tooltipContainer}
    >
      <span className={showTooltip ? styleVisible : styleInvisible}>{tooltipText}</span>
      {children}
    </span>
  )
}
