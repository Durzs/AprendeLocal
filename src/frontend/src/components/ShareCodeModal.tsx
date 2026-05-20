/**
 * ShareCodeModal.tsx — Modal para que el profesor genere y comparta un código
 *
 * Muestra el código grande + botón copiar + link directo
 */
import { useState, useEffect } from "react";
import type { ShareCode } from "../types";
import { createShareCode } from "../api";

interface Props {
  projectId: string;
  projectTitle: string;
  teacherId: string;
  schoolId: string;
  onClose: () => void;
}

export default function ShareCodeModal({
  projectId,
  projectTitle,
  teacherId,
  schoolId,
  onClose,
}: Props) {
  const [shareCode, setShareCode] = useState<ShareCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createShareCode(projectId, teacherId, schoolId)
      .then(setShareCode)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error generando código")
      )
      .finally(() => setLoading(false));
  }, [projectId, teacherId, schoolId]);

  const directLink = shareCode
    ? `${window.location.origin}?code=${shareCode.code}`
    : "";

  async function handleCopyCode() {
    if (!shareCode) return;
    try {
      await navigator.clipboard.writeText(shareCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(directLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="share-modal">
          <h2>Compartir Proyecto</h2>
          <p className="share-project-name">{projectTitle}</p>

          {loading && <p className="share-loading">Generando código...</p>}
          {error && <p className="student-error">{error}</p>}

          {shareCode && (
            <>
              <div className="share-code-display">
                <span className="share-code-value">{shareCode.code}</span>
                <button className="btn-copy" onClick={handleCopyCode}>
                  {copied ? "¡Copiado!" : "Copiar código"}
                </button>
              </div>

              <div className="share-instructions">
                <h4>¿Cómo comparto con mis estudiantes?</h4>
                <ol>
                  <li>
                    <strong>Código:</strong> Dicta el código{" "}
                    <strong>{shareCode.code}</strong> en clase
                  </li>
                  <li>
                    <strong>Link directo:</strong> Comparte este enlace
                  </li>
                </ol>
                <div className="share-link-row">
                  <input
                    type="text"
                    readOnly
                    value={directLink}
                    className="share-link-input"
                  />
                  <button className="btn-copy-small" onClick={handleCopyLink}>
                    Copiar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
