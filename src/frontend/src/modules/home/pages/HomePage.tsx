import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../../shared/lib/supabaseClient";

import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import CoursesSection from "../components/CoursesSection";
import CallToAction from "../components/CallToAction";

import type { Course, Particle } from "../types";

export default function HomePage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [errorCourses, setErrorCourses] = useState<string>("");
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadPopularCourses() {
      setLoadingCourses(true);
      setErrorCourses("");

      const { data, error } = await supabase
        .from("courses")
        .select("id, titulo, categoria, nivel")
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

    if (typeof window !== "undefined") {
      setParticles(
        Array.from({ length: 20 }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          scale: Math.random() * 0.5 + 0.5,
          dx: Math.random() * 100 - 50,
          dy: Math.random() * -100 - 50,
          duration: Math.random() * 10 + 10,
        }))
      );
    }

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
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-blue-950 via-blue-600 to-blue-300
        dark:from-blue-950 dark:via-blue-600 dark:to-blue-300
        relative overflow-hidden
      "
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <HeroSection onStart={goStart} onExplore={goExplore} />
        <FeaturesSection />
        <CoursesSection
          courses={courses}
          loading={loadingCourses}
          error={errorCourses}
        />
        <CallToAction onStart={goStart} />
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            initial={{
              x: particle.x,
              y: particle.y,
              scale: particle.scale,
            }}
            animate={{
              x: [particle.x, particle.x + particle.dx],
              y: [particle.y, particle.y + particle.dy],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute w-2 h-2 bg-blue-300 dark:bg-white rounded-full opacity-30"
          />
        ))}
      </div>
    </div>
  );
}