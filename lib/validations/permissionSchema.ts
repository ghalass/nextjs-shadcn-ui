// lib/validation/permissionSchema.ts
import * as Yup from "@/lib/yupFr";

export const permissionSchema = Yup.object({
  name: Yup.string()
    .required("Le nom de la permission est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  resource: Yup.string()
    .required("La ressource est requise")
    .min(2, "La ressource doit contenir au moins 2 caractères")
    .max(50, "La ressource ne peut pas dépasser 50 caractères"),
  action: Yup.string()
    .required("L'action est requise")
    .oneOf(
      ["read", "create", "update", "delete", "manage"],
      "L'action doit être: read, create, update, delete ou manage"
    ),
  description: Yup.string()
    .max(255, "La description ne peut pas dépasser 255 caractères")
    .optional(),
});

export type PermissionFormData = Yup.InferType<typeof permissionSchema>;
