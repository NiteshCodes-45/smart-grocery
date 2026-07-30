import { useEffect } from "react";
import company from "../../company.json";

const setMeta = (attribute, key, content) => {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

export default function SeoMetadata() {
  useEffect(() => {
    const title = company.seo.title;
    const description = company.seo.description;
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: company.productName,
      applicationCategory: "ShoppingApplication",
      operatingSystem: "Android",
      url: company.playStoreUrl,
      downloadUrl: company.playStoreUrl,
      softwareVersion: company.productVersion,
      author: {
        "@type": "Organization",
        name: company.companyName,
        url: company.website,
      },
      offers: {
        "@type": "Offer",
        url: company.playStoreUrl,
        availability: "https://schema.org/InStock",
      },
    };

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "author", company.seo.author);
    setMeta("name", "organization", company.seo.organization);
    setMeta("name", "application-name", company.seo.application);
    setMeta("property", "og:site_name", company.productName);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let structuredDataTag = document.head.querySelector("#smart-grocery-jsonld");

    if (!structuredDataTag) {
      structuredDataTag = document.createElement("script");
      structuredDataTag.id = "smart-grocery-jsonld";
      structuredDataTag.type = "application/ld+json";
      document.head.appendChild(structuredDataTag);
    }

    structuredDataTag.textContent = JSON.stringify(structuredData);
  }, []);

  return null;
}
