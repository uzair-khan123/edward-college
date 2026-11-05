import type { MetadataRoute } from "next";

const siteUrl = "https://www.edwardmodelcollege.edu.pk";

const routes = [
  "", "about", "about/principal", "academics", "departments", "faculty",
  "campus-life", "gallery", "notices", "admissions", "contact", "privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: route === "notices" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
