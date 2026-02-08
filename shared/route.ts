import { z } from 'zod';
import { insertComplaintSchema, complaints, updateStatusSchema, loginSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  complaints: {
    create: {
      method: 'POST' as const,
      path: '/api/complaints',
      input: insertComplaintSchema,
      responses: {
        201: z.custom<typeof complaints.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    search: {
      method: 'GET' as const,
      path: '/api/complaints/search', // ?ticket=TKT-XXXX
      input: z.object({ ticket: z.string() }),
      responses: {
        200: z.custom<typeof complaints.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/complaints',
      responses: {
        200: z.array(z.custom<typeof complaints.$inferSelect>()),
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/complaints/:id/status',
      input: updateStatusSchema,
      responses: {
        200: z.custom<typeof complaints.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login',
      input: loginSchema,
      responses: {
        200: z.object({ success: z.boolean() }),
        401: errorSchemas.unauthorized,
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

