import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const selector = searchParams.get("selector");

  if (!url || !selector) {
    return NextResponse.json({ error: "URL i selektor są wymagane" }, { status: 400 });
  }

  try {
    // Pobierz stronę
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "pl,en-US;q=0.7,en;q=0.3",
      },
    });

    const html = await response.text();
    const baseUrl = new URL(url).origin;

    // Użyj Cheerio do parsowania HTML
    const $ = cheerio.load(html);

    // Pobierz wybrany fragment
    const selectedElement = $(selector);

    if (selectedElement.length === 0) {
      return NextResponse.json({ error: "Nie znaleziono elementu o podanym selektorze" }, { status: 404 });
    }

    // Pobierz HTML wybranego elementu
    const selectedContent = selectedElement.prop("outerHTML");

    // Pobierz wszystkie linki do arkuszy stylów
    const styleLinks = $('link[rel="stylesheet"]')
      .map((_, el) => {
        const href = $(el).attr("href");
        if (!href) return "";

        // Konwertuj względne URL na absolutne
        let absoluteHref = href;
        if (href.startsWith("/")) {
          absoluteHref = `${baseUrl}${href}`;
        } else if (!href.startsWith("http")) {
          absoluteHref = new URL(href, url).href;
        }

        return `<link rel="stylesheet" href="${absoluteHref}">`;
      })
      .get()
      .join("\n");

    // Pobierz wszystkie style inline
    const inlineStyles = $("style")
      .map((_, el) => $(el).html())
      .get()
      .join("\n");

    // Specjalne style dla TMDB
    const tmdbSpecificStyles = `
      /* Style specyficzne dla TMDB */
      .header {
        background-size: cover !important;
        background-position: center !important;
        color: #fff !important;
        padding: 20px !important;
        display: flex !important;
        flex-direction: column !important;
      }
      
      .header.large {
        height: auto !important;
        min-height: 300px !important;
      }
      
      .header .poster {
        display: block !important;
        width: 100% !important;
        max-width: 300px !important;
        margin-right: 20px !important;
      }
      
      .header .poster img {
        width: 100% !important;
        height: auto !important;
        border-radius: 5px !important;
      }
      
      .header h2 {
        margin: 0 !important;
        font-size: 2.2em !important;
        font-weight: 700 !important;
        color: #fff !important;
      }
      
      .header .facts {
        margin: 10px 0 !important;
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
      }
      
      .header .overview {
        margin-top: 20px !important;
        font-size: 1em !important;
        line-height: 1.4 !important;
      }
      
      .header .actions {
        margin-top: 20px !important;
        display: flex !important;
        align-items: center !important;
      }
      
      .header .action {
        margin-right: 15px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 46px !important;
        height: 46px !important;
        border-radius: 50% !important;
        background-color: rgba(3, 37, 65, 0.8) !important;
        color: #fff !important;
        text-decoration: none !important;
      }
      
      /* Dodatkowe style dla responsywności */
      @media (max-width: 768px) {
        .header {
          flex-direction: column !important;
        }
        
        .header .poster {
          margin-right: 0 !important;
          margin-bottom: 20px !important;
        }
      }
    `;

    // Stwórz nowy dokument HTML, który zawiera tylko wybrany fragment
    const result = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <base href="${url}">
        
        <!-- Oryginalne arkusze stylów -->
        ${styleLinks}
        
        <!-- Oryginalne style inline -->
        <style>${inlineStyles}</style>
        
        <!-- Style specyficzne dla TMDB -->
        <style>${tmdbSpecificStyles}</style>
        
        <style>
          /* Podstawowe style dla kontenera */
          body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: auto;
            overflow-x: hidden;
            background-color: transparent;
          }
          
          /* Ukryj wszystkie elementy w body */
          body > *:not(#extracted-content-container) {
            display: none !important;
          }
          
          /* Pokaż tylko nasz kontener */
          #extracted-content-container {
            display: block !important;
            padding: 0;
            margin: 0;
            width: 100%;
            box-sizing: border-box;
          }
          
          /* Zapewnij, że obrazy są responsywne */
          #extracted-content-container img {
            max-width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div id="extracted-content-container">
          ${selectedContent}
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            // Popraw względne ścieżki w obrazach
            document.querySelectorAll('#extracted-content-container img[src]').forEach(function(img) {
              var src = img.getAttribute('src');
              if (src && src.startsWith('/')) {
                img.src = '${baseUrl}' + src;
              }
            });
            
            // Popraw względne ścieżki w linkach
            document.querySelectorAll('#extracted-content-container a[href]').forEach(function(a) {
              var href = a.getAttribute('href');
              if (href && href.startsWith('/')) {
                a.href = '${baseUrl}' + href;
              }
            });
            
            // Popraw style tła (dla TMDB)
            var headerElement = document.querySelector('.header.large');
            if (headerElement) {
              var style = getComputedStyle(headerElement);
              var backgroundImage = style.backgroundImage;
              
              // Jeśli nie ma tła, spróbuj pobrać je z atrybutu style
              if (!backgroundImage || backgroundImage === 'none') {
                var inlineStyle = headerElement.getAttribute('style');
                if (inlineStyle) {
                  headerElement.setAttribute('style', inlineStyle);
                }
              }
            }
            
            // Powiadom rodzica o załadowaniu
            setTimeout(function() {
              if (window.parent) {
                var height = document.getElementById('extracted-content-container').scrollHeight;
                window.parent.postMessage({ 
                  type: 'contentLoaded', 
                  height: height
                }, '*');
              }
            }, 500);
          });
        </script>
      </body>
      </html>
    `;

    // Zwróć dokument HTML z wybranym fragmentem
    return new NextResponse(result, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania strony:", error);
    return NextResponse.json({ error: "Wystąpił błąd podczas pobierania strony" }, { status: 500 });
  }
}
