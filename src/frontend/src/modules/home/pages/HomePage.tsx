import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../shared/lib/supabaseClient";

import HeroSection from "../components/HeroSection";
import CountrySection from "../components/CountrySection";
import PillarsSection from "../components/PillarsSection";
import PlaceBasedLearningSection from "../components/PlaceBasedLearningSection";
import MakerPuzzle from "../components/MakerPuzzle";
import CoursesSection from "../components/CoursesSection";
import ContactSection from "../components/ContactSection";
import CallToAction from "../components/CallToAction";

import type { Course } from "../types";

export default function HomePage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [errorCourses, setErrorCourses] = useState<string>("");
  const [, setIsLogged] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function loadPopularCourses() {
      setLoadingCourses(true);
      setErrorCourses("");

      const { data, error } = await supabase
        .from("courses")
        .select("id, titulo, categoria, nivel, url_img, descricao")
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
    navigate("/plataforma?tab=courses");
  };

  const goExplore = () => {
    navigate("/plataforma?tab=makerspaces");
  };

  return (
    <main className="min-h-screen bg-white text-[#111217]">
      {/* 1. Hero Original */}
      <HeroSection onStart={goStart} onExplore={goExplore} />

      {/* 2. Oportunidades STEM contextualizadas (Selector Chile / Brasil) */}
      <CountrySection />

      {/* 3. Pilares Fundamentales estilo iNaturalist */}
      <PillarsSection />

      {/* 4. El poder del aprendizaje basado en el lugar */}
      <PlaceBasedLearningSection />

      {/* 5. Estación interactiva Maker */}
      <MakerPuzzle />

      {/* 6. Cursos populares de la plataforma */}
      <CoursesSection
        courses={courses}
        loading={loadingCourses}
        error={errorCourses}
      />

      {/* 7. Contacto para docentes y escuelas */}
      <ContactSection />

      {/* 8. Call to Action final */}
      <CallToAction onStart={goStart} />
    </main>
  );
}
