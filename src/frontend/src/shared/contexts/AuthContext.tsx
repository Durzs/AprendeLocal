import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import i18n from "../i18n";
import { SEDE_POR_DEFECTO, idiomaAlEntrar, sedeDe, type Sede } from "../sede";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  accessToken: string | null;
  /**
   * Qué edición de la plataforma le toca a esta cuenta. Sin sesión es la de
   * por defecto, que es la que ve cualquiera que llegue a la portada.
   */
  sede: Sede;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      setLoading(true);

      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      setLoading(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!isMounted) return;
        setSession(nextSession ?? null);
        setUser(nextSession?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const sede = user ? sedeDe(user.user_metadata) : SEDE_POR_DEFECTO;

  /*
   * El idioma de la sede, al entrar.
   *
   * Thais abre la plataforma desde Río y le tiene que salir en portugués sin
   * ir a buscar el conmutador. Va en un efecto y no al calcular `sede` porque
   * `i18n.changeLanguage` es un efecto de verdad: toca el documento y avisa a
   * todo el árbol.
   *
   * `idiomaAlEntrar` devuelve `null` cuando la persona ya eligió idioma a
   * mano, y entonces esto no hace nada: esa decisión es suya y no la revierte
   * una sesión nueva.
   */
  useEffect(() => {
    if (!user) return;
    const debido = idiomaAlEntrar(sede, i18n.resolvedLanguage ?? "es");
    if (debido) i18n.changeLanguage(debido);
  }, [user, sede]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        accessToken: session?.access_token ?? null,
        sede,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within the AuthProvider");
  }

  return context;
}