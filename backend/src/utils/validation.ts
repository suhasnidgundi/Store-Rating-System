import { z } from "zod";
import { sanitizeString } from "./sanitize";

const str = (min = 1, max = 255) =>
  z.preprocess(sanitizeString, z.string().min(min).max(max));

export const registerSchema = z.object({
  body: z.object({
    name: str(2, 120),
    email: z.preprocess(sanitizeString, z.string().email()),
    password: str(8, 128),
    address: str(0, 255)
      .optional()
      .or(z.literal("").transform(() => undefined)),
    role: z.enum(["USER", "OWNER"]).optional().default("USER"),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.preprocess(sanitizeString, z.string().email()),
    password: str(8, 128),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const createStoreSchema = z.object({
  body: z.object({
    name: str(2, 120),
    email: z.preprocess(sanitizeString, z.string().email()),
    address: str(2, 255),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const updateStoreSchema = z.object({
  body: z.object({
    name: str(2, 120).optional(),
    email: z.preprocess(sanitizeString, z.string().email()).optional(),
    address: str(2, 255).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().min(10),
  }),
});

export const listStoresSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({
    q: z.string().optional(),
    ownerId: z.string().optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    maxRating: z.coerce.number().min(0).max(5).optional(),
    page: z.coerce.number().optional(),
    pageSize: z.coerce.number().optional(),
    sort: z.enum(["name", "rating", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
  params: z.object({}).passthrough(),
});

export const ratingCreateOrUpdateSchema = z.object({
  body: z.object({
    storeId: z.string().min(10),
    rating: z.coerce.number().int().min(1).max(5),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

export const ratingDeleteSchema = z.object({
  body: z.object({}).passthrough(),
  query: z.object({}).passthrough(),
  params: z.object({
    id: z.string().min(10),
  }),
});
