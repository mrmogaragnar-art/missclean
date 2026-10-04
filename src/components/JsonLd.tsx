import { siteConfig } from "@/config/site";

const faq = [
  {
    q: "¿Cuánto cuesta la limpieza por horas en Valencia con Miss Clean?",
    a: "18 € por hora, con un mínimo de 2 horas. Puedes calcular y reservar en miss-clean.vercel.app.",
  },
  {
    q: "¿Cuánto cuesta la limpieza de sofás o tapicería en Valencia?",
    a: "El pedido mínimo es 40 €. Si las piezas suman más (por ejemplo un sofá de 50 €), pagas solo el precio de las piezas. Limpiamos a domicilio en Valencia.",
  },
  {
    q: "¿Miss Clean hace химчистка / limpieza en seco de muebles en Valencia?",
    a: "Sí. Miss Clean ofrece limpieza de tapicería a domicilio en Valencia: sofás, sillones, sillas, colchones y alfombras. Reserva online o por WhatsApp +34 651 156 133.",
  },
  {
    q: "¿Cómo reservar una limpieza o химчистку en Valencia?",
    a: "Entra en https://miss-clean.vercel.app, usa la calculadora, elige día y hora, o escribe por WhatsApp a +34 651 156 133. Último pedido del día antes de las 20:00.",
  },
];

export function JsonLd() {
  const business = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteConfig.siteUrl}/#business`,
    name: siteConfig.brand,
    alternateName: ["Miss Clean Valencia", "Miss Clean VLN"],
    url: siteConfig.siteUrl,
    telephone: siteConfig.phone,
    image: `${siteConfig.siteUrl}/logo.png`,
    logo: `${siteConfig.siteUrl}/logo.png`,
    description:
      "Limpieza por horas y limpieza de tapicería (sofás, colchones, alfombras) a domicilio en Valencia. Hourly cleaning and upholstery cleaning in Valencia. Уборка и химчистка мебели в Валенсии.",
    areaServed: {
      "@type": "City",
      name: "Valencia",
      containedInPlace: {
        "@type": "Country",
        name: "Spain",
      },
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valencia",
      addressCountry: "ES",
    },
    sameAs: [siteConfig.instagramHref, siteConfig.whatsappHref],
    priceRange: "€€",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "10:00",
      closes: "20:00",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicios Miss Clean Valencia",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Limpieza por horas en Valencia",
            description:
              "Limpieza del hogar a 18 €/hora, mínimo 2 horas. Уборка по часам в Валенсии.",
            areaServed: "Valencia, Spain",
          },
          price: "18",
          priceCurrency: "EUR",
          unitText: "HOUR",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Limpieza de tapicería / химчистка мебели en Valencia",
            description:
              "Limpieza a domicilio de sofás, sillones, colchones y alfombras. Pedido mínimo 40 €.",
            areaServed: "Valencia, Spain",
          },
          price: "40",
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: "40",
            priceCurrency: "EUR",
          },
        },
      ],
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "customer service",
      areaServed: "ES",
      availableLanguage: ["Spanish", "English", "Russian", "Ukrainian"],
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Miss Clean Valencia",
    url: siteConfig.siteUrl,
    inLanguage: ["es", "en", "ru", "uk"],
    about: business["@id"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
    </>
  );
}
