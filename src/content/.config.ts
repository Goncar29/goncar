import { defineCollection, z } from "astro:content";

const projects = defineCollection({
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        image: z.string().optional(),
        link: z.string().optional(),
        tags: z.array(z.string()),
        layout: z.string(),
        slug: z.string().optional(),
    }),
});

export const collections = {
    projects,
};
