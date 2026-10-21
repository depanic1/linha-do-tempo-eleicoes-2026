import { useState } from "react";
import type { Midia as MidiaT } from "../lib/schema";

function idYoutube(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function idTiktok(url: string): string | null {
  const m = url.match(/\/video\/(\d+)/);
  return m ? m[1] : null;
}

/** Embeds só carregam depois do clique: a página fica leve e ninguém é rastreado sem querer. */
export function Midia({ midia }: { midia: MidiaT }) {
  const [ativo, setAtivo] = useState(false);
  if (!midia.url) return null;

  const legenda = (midia.legenda || midia.credito) && (
    <figcaption className="mt-2 font-mono text-[11px] text-cinza">
      {midia.legenda}
      {midia.credito && <span className="text-cinza/70"> · {midia.credito}</span>}
    </figcaption>
  );

  if (midia.tipo === "imagem") {
    return (
      <figure>
        <img src={midia.url} alt={midia.legenda ?? ""} loading="lazy" className="w-full border border-linha object-cover" />
        {legenda}
      </figure>
    );
  }

  const yt = midia.tipo === "youtube" ? idYoutube(midia.url) : null;
  const tt = midia.tipo === "tiktok" ? idTiktok(midia.url) : null;
  const embed = yt
    ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1`
    : tt
      ? `https://www.tiktok.com/embed/v2/${tt}`
      : null;

  if (!embed) {
    return (
      <a href={midia.url} target="_blank" rel="noopener noreferrer" className="inline-block font-mono text-xs uppercase tracking-widest text-amarelo underline underline-offset-4">
        Ver vídeo ↗
      </a>
    );
  }

  const vertical = midia.tipo === "tiktok";
  return (
    <figure className={vertical ? "max-w-[325px]" : ""}>
      <div className={`relative overflow-hidden border border-linha bg-grafite ${vertical ? "aspect-[9/16]" : "aspect-video"}`}>
        {ativo ? (
          <iframe
            src={embed}
            title={midia.legenda ?? "Vídeo"}
            className="absolute inset-0 size-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setAtivo(true)}
            className="group absolute inset-0 flex items-center justify-center"
            aria-label="Carregar vídeo"
          >
            {yt && (
              <img
                src={`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="absolute inset-0 size-full object-cover opacity-60 transition-opacity group-hover:opacity-80"
              />
            )}
            <span className="relative flex size-16 items-center justify-center rounded-full bg-amarelo text-noite transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="ml-1 size-7" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-widest text-nevoa">
              {midia.tipo === "tiktok" ? "TikTok" : "YouTube"} · carrega ao clicar
            </span>
          </button>
        )}
      </div>
      {legenda}
    </figure>
  );
}
