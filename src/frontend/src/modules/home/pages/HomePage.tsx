import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../shared/lib/supabaseClient";

import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import MapSection from "../components/MapSection";
import CoursesSection from "../components/CoursesSection";
import CallToAction from "../components/CallToAction";

import type { Course } from "../types";

export default function HomePage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [errorCourses, setErrorCourses] = useState<string>("");
  const [isLogged, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function loadPopularCourses() {
      setLoadingCourses(true);
      setErrorCourses("");

      const { data, error } = await supabase
        .from("courses")
        .select("id, titulo, categoria, nivel, imagen_url, descripcion")
        .order("id", { ascending: true })
        .limit(3);

      if (!mounted) return;

      if (error) {
        setErrorCourses(error.message);
        setCourses([]);
      } else {
        setCourses((data as Course[]) ?? []);
      }

      setLoadingCourses(false);
    }

    async function checkAuth() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setIsLogged(!!data?.session);
    }

    loadPopularCourses();
    checkAuth();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsLogged(!!session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const goStart = () => {
    navigate(isLogged ? "/cursos" : "/entrar");
  };

  const goExplore = () => {
    navigate("/makerspaces");
  };

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      <HeroSection onStart={goStart} onExplore={goExplore} />
      <FeaturesSection />
      <MapSection />
      <CoursesSection
        courses={courses}
        loading={loadingCourses}
        error={errorCourses}
      />
      <CallToAction onStart={goStart} />
    </main>
  );
}
