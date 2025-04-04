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
            <>The site was created for parents looking for valuable movies that are safe to watch with their children and teens.</>
          )}
          {slideIndex === 1 && (
            <>
              These are films that we watched with our teenage children. The movies clearly show what is good and what is evil, and they
              promote Christian values like family, friendship, love, hope, helping those in need, sacrifice, and respect for others.
            </>
          )}
          {slideIndex === 2 &&
            "films that are suitable for all the family. We want to avoid films with stupid violence, bad language, scenes that are too sexual, films that are controversial, or films that do not follow basic moral rules"}
        </div>
      ))}
    </div>
  );
};
