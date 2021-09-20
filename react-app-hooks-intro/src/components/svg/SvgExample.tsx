import { FC } from "react"
import { ReactComponent as Car } from "./car.svg"

export const SvgExample: FC = (props) => {
  return (
    <div className={"Container"}>
      <Car className={"SvgImage"} />
    </div>
  )
}
