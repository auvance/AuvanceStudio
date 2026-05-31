import { GRAIN_DATA_URI } from "./svg";

/** Fixed, very subtle film grain over the whole page. */
export default function Grain() {
  return <div className="grain" style={{ backgroundImage: `url("${GRAIN_DATA_URI}")` }} aria-hidden />;
}
