import { FC } from "react"
import styles from "../../styles/App.module.css"
import { ReactComponent as Car } from "./car.svg"

export const SvgExample: FC = () => {
  return (
    <div className={styles.Container}>
      <Car className={styles.SvgImage} />
    </div>
  )
}
