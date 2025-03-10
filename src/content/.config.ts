import { defineCollection, z } from "astro:content";

const projects = defineCollection({
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        image: z.string().optional(), // La imagen es opcional, por si algún proyecto no la tiene.
        link: z.string().optional(), // El enlace es opcional.
        tags: z.string(),
        layout: z.string(), // Usas un layout específico.
        slug: z.string().optional(),
    }),
});

export const collections = {
    projects,
};
