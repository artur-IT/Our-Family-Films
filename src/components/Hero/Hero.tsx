import style from "@/components/Hero/Hero.module.css";

export const Hero = () => {
  return (
    <div className={style.hero}>
      <div className={style.description}>
        Znajdziesz tu rekomendacje filmów odpowiednich dla całej rodziny – bez przemocy, wulgarnego języka, scen niemoralnych,
        kontrowersyjnych treści czy treści podważających podstawowe zasady etyczne. Filmy, które obejrzeliśmy razem z naszymi nastoletnimi
        dziećmi. Jest w nich wyraźnie zarysowane dobro i zło, promowane są wartości chrześcijańskie m.in. rodzina, przyjaźń, miłość,
        nadzieja, pomoc słabszym i potrzebującym, poświęcenie, szacunek dla innych. To filmy, które inspirują, podnoszą na duchu i
        wzmacniają więzi rodzinne.
      </div>
    </div>
  );
};
