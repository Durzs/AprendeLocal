import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { supabase } from "../../../shared/lib/supabaseClient";
import { mensajeDe } from "../../../shared/lib/errores";

type Avatar = {
  id: string | number;
  name: string | null;
  url: string;
};

type AvatarPickerModalProps = {
  open: boolean;
  onClose: () => void;
  onSelected?: (avatar: Avatar) => void;
};

export function AvatarPickerModal({
  open,
  onClose,
  onSelected,
}: AvatarPickerModalProps) {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [erro, setErro] = useState("");

  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    let alive = true;

    async function loadAvatars() {
      setLoading(true);
      setErro("");

      try {
        const { data, error } = await supabase
          .from("avatars")
          .select("id, name, url")
          .eq("is_active", true)
          .order("id", { ascending: true });

        if (error) throw error;
        if (alive) setAvatars((data as Avatar[]) || []);
      } catch (e) {
        if (alive) setErro(mensajeDe(e, t("avatarModal.errorLoad")));
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadAvatars();

    return () => {
      alive = false;
    };
  }, [open, t]);

  async function selectAvatar(avatar: Avatar) {
    setLoading(true);
    setErro("");

    try {
      const { data: userResp, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;

      const user = userResp?.user;
      if (!user) throw new Error(t("avatarModal.userNotLogged"));

      const { error: upErr } = await supabase
        .from("profiles")
        .update({ avatar_id: avatar.id })
        .eq("id", user.id);

      if (upErr) throw upErr;

      onSelected?.(avatar);
      onClose();
    } catch (e) {
      if (aliveRef.current) {
        setErro(mensajeDe(e, t("avatarModal.errorUpdate")));
      }
    } finally {
      if (aliveRef.current) setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-xl border overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="text-xl font-bold">{t("avatarModal.title")}</h2>
            <p className="text-sm text-slate-500">{t("avatarModal.subtitle")}</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition"
            aria-label={t("avatarModal.closeAria")}
          >
            <X />
          </button>
        </div>

        <div className="p-5">
          {erro && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 border">
              {erro}
            </div>
          )}

          {loading && avatars.length === 0 ? (
            <div className="text-slate-500">{t("avatarModal.loading")}</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {avatars.map((a) => {
                const titleText =
                  a.name || t("avatarModal.avatarWithId", { id: a.id });
                const altText = a.name || t("avatarModal.avatarFallback");

                return (
                  <button
                    type="button"
                    key={a.id}
                    onClick={() => selectAvatar(a)}
                    disabled={loading}
                    className="group rounded-2xl border hover:shadow-md transition p-2 disabled:opacity-50"
                    title={titleText}
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50">
                      <img
                        src={a.url}
                        alt={altText}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-2 text-xs text-slate-500 truncate">
                      {titleText}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-5 border-t flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border hover:bg-slate-50 transition"
          >
            {t("avatarModal.cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}