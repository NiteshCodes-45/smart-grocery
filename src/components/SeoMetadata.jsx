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
    const title = `${company.seo.openGraphTitle} - Practical Grocery Shopping & Spending Tracker`;
    const description = `${company.seo.openGraphTitle} helps households organize grocery shopping, track spending patterns, manage shopping sessions, and maintain clean purchase history.`;

    document.title = title;
    setMeta("name", "description", description);
    setMeta("name", "author", company.seo.author);
    setMeta("name", "organization", company.seo.organization);
    setMeta("name", "application-name", company.seo.application);
    setMeta("property", "og:site_name", company.productName);
    setMeta("property", "og:title", company.seo.openGraphTitle);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:title", company.seo.openGraphTitle);
    setMeta("name", "twitter:description", description);
  }, []);

  return null;
}
