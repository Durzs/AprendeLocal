import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { fijarSedeDeCuenta, sedeDe, useSede, type Sede } from "../sede";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  accessToken: string | null;
  /**
   * Qué edición de la plataforma se está viendo. Con sesión es la de la
   * cuenta; sin ella, la que eligió quien mira. Ver §sede.ts.
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

  /*
   * La sede de la cuenta manda sobre la del navegador.
   *
   * Se empuja a §sede.ts, que es de donde leen todas las pantallas y el
   * idioma. Thais abre la plataforma desde un computador cualquiera y le sale
   * la edición brasileña, en portugués, sin buscar nada. Al salir, la sede
   * queda como estaba en el navegador, que ya es la suya.
   */
  const sedeCuenta = user ? sedeDe(user.user_metadata) : null;
  useEffect(() => {
    if (loading) return;
    fijarSedeDeCuenta(sedeCuenta);
  }, [sedeCuenta, loading]);

  const sede = useSede();

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