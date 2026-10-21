import { useLayoutEffect, useState, type ReactNode } from "react";

export type Formato = "9x16" | "16x9";

export const DIMENSOES: Record<Formato, { w: number; h: number; seguro: number }> = {
  // Faixas de 220px em cima e embaixo: o TikTok cobre com comentários e botões.
  "9x16": { w: 1080, h: 1920, seguro: 220 },
  "16x9": { w: 1920, h: 1080, seguro: 0 },
};

/** Tela em pixels reais (1080×1920 ou 1920×1080), redimensionada para caber na janela. */
export function Palco({ formato, guias, children }: { formato: Formato; guias: boolean; children: ReactNode }) {
  const { w, h, seguro } = DIMENSOES[formato];
  const [escala, setEscala] = useState(1);

  useLayoutEffect(() => {
    const ajustar = () => setEscala(Math.min(window.innerWidth / w, window.innerHeight / h));
    ajustar();
    window.addEventListener("resize", ajustar);
    return () => window.removeEventListener("resize", ajustar);
  }, [w, h]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <div
        className="absolute left-1/2 top-1/2 overflow-hidden bg-noite"
        style={{ width: w, height: h, transform: `translate(-50%, -50%) scale(${escala})` }}
        data-formato={formato}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(90% 55% at 50% 0%, rgba(255,214,10,0.07), transparent 60%)" }}
        />
        {children}
        {guias && seguro > 0 && (
          <>
            <div className="zona-segura pointer-events-none absolute inset-x-0 top-0 z-50" style={{ height: seguro }}>
              <span className="absolute bottom-3 left-4 font-mono text-xl text-red-300">zona do TikTok · 220px</span>
            </div>
            <div className="zona-segura pointer-events-none absolute inset-x-0 bottom-0 z-50" style={{ height: seguro }}>
              <span className="absolute left-4 top-3 font-mono text-xl text-red-300">zona do TikTok · 220px</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
