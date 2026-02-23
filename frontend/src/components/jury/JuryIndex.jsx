import { useEffect, useState } from "react";
import { Link } from "react-router";
import { juryService } from "../../services/jury.service";
import JuryCard from "../../components/jury/JuryCard.jsx";
import JuryCreateModal from "./JuryCreateModal.jsx"

export default function JuryIndex() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await juryService.list();
      const data = res?.data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setApiError(null);
        const res = await juryService.list();
        const data = res?.data ?? [];
        if (alive) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (alive) setApiError(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="px-4 py-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Jury</h1>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-white"
            >
              Ajouter
            </button>
          </div>
        </div>

        {apiError && (
          <div className="mb-4 rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-red-200">
            <div className="font-semibold text-sm">
              Erreur {apiError.httpStatus ? `(HTTP ${apiError.httpStatus})` : ""}
            </div>
            <div className="text-xs opacity-90">
              {apiError.message || "Une erreur est survenue"}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-sm text-zinc-400">Chargement de la liste…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-zinc-400">Aucun membre trouvé.</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((j) => (
              <Link
                key={j.id}
                to={`/jury/${j.id}`}
                className="block rounded-2xl hover:bg-zinc-900/70 transition"
              >
                <JuryCard jury={j} />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* MODALE CREATE */}
      <JuryCreateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => refresh()}
      />
    </section>
  );
}