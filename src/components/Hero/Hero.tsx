"use client";
import style from "@/components/Hero/Hero.module.css";
import React, { useState } from "react";

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState("en");

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const content = {
    en: [
      "The site was created for parents looking for valuable movies that are safe to watch with their teens.",
      "These are films that we watched with our teenage children. The movies clearly show what is good and what is evil, and they promote Christian values like family, friendship, love, hope, helping those in need, sacrifice, and respect for others.",
      "Films that are suitable for all the family. We want to avoid films with stupid violence, bad language, scenes that are too sexual, films that are controversial, or films that do not follow basic moral rules",
    ],
    pl: [
      "Strona została stworzona dla rodziców poszukujących wartościowych filmów, które można bezpiecznie oglądać z nastolatkami.",

      "To filmy, które oglądaliśmy z naszymi nastoletnimi dziećmi. Filmy wyraźnie pokazują, co jest dobre, a co złe, oraz promują chrześcijańskie wartości, takie jak rodzina, przyjaźń, miłość, nadzieja, pomoc potrzebującym, poświęcenie i szacunek dla innych.",

      "Filmy odpowiednie dla całej rodziny. Chcemy unikać filmów przemocą, wulgarnym językiem, seksualnymi scenami, filmów kontrowersyjnych lub takich, które nie przestrzegają podstawowych zasad moralnych",
    ],
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "pl" : "en"));
  };

  return (
    <div className={style.hero}>
      <button onClick={toggleLanguage} className={style.languageToggle}>
        {language === "en" ? "PL" : "EN"}
      </button>

      {[0, 1, 2].map((slideIndex) => (
        <div
          key={slideIndex}
          className={style.description}
          style={{
            opacity: currentSlide === slideIndex ? 1 : 0,
            visibility: currentSlide === slideIndex ? "visible" : "hidden",
            transition: "opacity 1s ease-in-out, visibility 1s ease-in-out",
          }}
        >
          {content[language as keyof typeof content]?.[slideIndex] || content["en"][slideIndex]}
        </div>
      ))}
    </div>
  );
};
