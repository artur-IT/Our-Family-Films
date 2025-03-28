import React, { useState, useEffect, useRef } from "react";
import styles from "./ExternalContent.module.css";

interface ExternalContentProps {
  url: string;
  selector: string;
}

const ExternalContent: React.FC<ExternalContentProps> = ({ url, selector }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(400);
  const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}&selector=${encodeURIComponent(selector)}`;

  // Użyj useRef, aby śledzić, czy komponent jest zamontowany
  const isMounted = useRef(true);

  useEffect(() => {
    // Ustaw flagę zamontowania
    isMounted.current = true;

    // Funkcja do dostosowania wysokości iframe
    const adjustIframeHeight = () => {
      if (!isMounted.current) return;

      if (iframeRef.current && iframeRef.current.contentWindow) {
        try {
          const height = iframeRef.current.contentWindow.document.body.scrollHeight;
          if (height > 100) {
            // Upewnij się, że wysokość jest sensowna
            setIframeHeight(height + 50); // Dodaj margines
          }
        } catch (e) {
          console.error("Nie można dostosować wysokości iframe:", e);
        }
      }
    };

    // Obsługa zdarzenia onLoad dla iframe
    const handleIframeLoad = () => {
      if (!isMounted.current) return;
      setLoading(false);

      // Opóźnij dostosowanie wysokości, aby dać czas na załadowanie stylów
      setTimeout(adjustIframeHeight, 1000);
    };

    // Nasłuchuj na wiadomości z iframe
    const handleMessage = (event: MessageEvent) => {
      if (!isMounted.current) return;

      // Sprawdź, czy wiadomość pochodzi z naszego iframe
      if (event.data && event.data.type === "contentLoaded") {
        if (event.data.height && event.data.height > 100) {
          setLoading(false);
          setIframeHeight(event.data.height + 50); // Dodaj margines
        }
      }
    };

    // Dodaj nasłuchiwanie na zdarzenia
    if (iframeRef.current) {
      iframeRef.current.onload = handleIframeLoad;
    }

    window.addEventListener("message", handleMessage);

    // Funkcja czyszcząca
    return () => {
      isMounted.current = false;
      window.removeEventListener("message", handleMessage);
    };
  }, [url, selector]);

  return (
    <div className={styles.externalContentWrapper}>
      {loading && <div className={styles.loading}>Ładowanie...</div>}
      {error && <div className={styles.error}>Błąd: {error}</div>}
      <div className={styles.externalContent}>
        <iframe
          ref={iframeRef}
          src={proxyUrl}
          className={styles.iframe}
          style={{
            height: `${iframeHeight}px`,
            width: "100%",
            border: "none",
            overflow: "hidden",
          }}
          frameBorder="0"
          scrolling="no"
          sandbox="allow-same-origin allow-scripts"
          onError={() => {
            if (isMounted.current) {
              setLoading(false);
              setError("Nie udało się załadować zawartości");
            }
          }}
        />
      </div>
    </div>
  );
};

export default ExternalContent;
