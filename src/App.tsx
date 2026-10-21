import { MotionConfig } from "framer-motion";
import { navegar, useModoEdicao, useRota, useTecla } from "./lib/hooks";
import { Home } from "./Home";
import { LiveMode } from "./live/LiveMode";

export default function App() {
  const rota = useRota();
  const [edicao, alternarEdicao] = useModoEdicao();
  const live = rota === "/live";

  useTecla((e) => {
    const k = e.key.toLowerCase();
    if (k === "l") navegar(live ? "/" : "/live");
    else if (k === "e" && !live) alternarEdicao();
  });

  return (
    <MotionConfig reducedMotion="user">
      {live ? (
        <LiveMode />
      ) : (
        <>
          <div className="vinheta" aria-hidden />
          <Home edicao={edicao} />
        </>
      )}
      <div className="grao" aria-hidden />
    </MotionConfig>
  );
}
