"use client";
import style from "@/components/Hero/Hero.module.css";
import React from "react";

export const Hero = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={style.hero}>
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
          {slideIndex === 0 && (
            <>
              Znajdziesz tu rekomendacje filmów odpowiednich dla całej rodziny. Bez przemocy, wulgarnego języka, scen niemoralnych,
              kontrowersyjnych treści czy treści podważających podstawowe zasady etyczne.
            </>
          )}
          {slideIndex === 1 && (
            <>
              Filmy, które obejrzeliśmy razem z naszymi nastoletnimi dziećmi. Jest w nich wyraźnie zarysowane dobro i zło, promowane są
              wartości chrześcijańskie m.in. rodzina, przyjaźń, miłość, nadzieja, pomoc słabszym i potrzebującym, poświęcenie, szacunek dla
              innych.
            </>
          )}
          {slideIndex === 2 && "To filmy, które inspirują, podnoszą na duchu i wzmacniają więzi rodzinne."}
        </div>
      ))}
    </div>
  );
};
