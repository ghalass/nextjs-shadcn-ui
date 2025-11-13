"use client";

import { LucidePlus, LucideTrash2, Pencil } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Yup from "@/lib/yupFr";
import React from "react";
import { Operation } from "@/lib/enums";
import Spinner from "@/components/Spinner";
import { useSites } from "@/hooks/useSites";
import { Site } from "@prisma/client";

export default function UsersPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { sites, loading, error, createSite, updateSite, deleteSite, refetch } =
    useSites();
  const [op, setOp] = React.useState<Operation>(Operation.READ);
  const [selectedSite, setSelectedSite] = React.useState<Partial<Site>>({});

  // Validation dynamique selon l'opération
  const getValidationSchema = (operation: Operation) => {
    return Yup.object({
      name: Yup.string().required().label("Nom"),
    });
  };

  const initialValues: Partial<Site> = {
    name: "",
  };

  const formValues =
    op === Operation.UPDATE || op === Operation.DELETE
      ? {
          name: selectedSite.name ?? "",
        }
      : initialValues;

  // À l'intérieur de UsersPage, avant le return
  const handleFormSubmit = async (
    values: Partial<Site>,
    resetForm: () => void
  ) => {
    try {
      setIsSubmitting(true); // ← début de soumission

      switch (op) {
        case Operation.CREATE:
          await createSite({
            name: values.name!,
          });
          break;

        case Operation.UPDATE:
          if (!selectedSite.id) return;
          await updateSite({
            id: selectedSite.id,
            name: values.name!,
          });
          break;

        case Operation.DELETE:
          if (!selectedSite.id) return;
          await deleteSite(selectedSite.id);
          break;
      }

      // Réinitialise le formulaire et l'état
      if (op === Operation.DELETE) {
        resetForm();
        setOp(Operation.READ);
        setSelectedSite({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false); // ← fin de soumission
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-2 font-semibold text-lg">Liste des utilisateurs</h1>
      <div className="flex items-start gap-4">
        {/* Formulaire toujours affiché */}
        <div className="border border-slate-200 p-3 rounded-md w-80">
          <Formik
            initialValues={formValues}
            validationSchema={getValidationSchema(op)}
            enableReinitialize
            onSubmit={(values, { resetForm }) =>
              handleFormSubmit(values, resetForm)
            }
          >
            {() => (
              <Form className="flex flex-col gap-2" autoComplete="off">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setOp(Operation.CREATE);
                    setSelectedSite({});
                  }}
                  className="py-1 px-2 border rounded-sm border-slate-300 mb-2 hover:cursor-pointer"
                >
                  Nouveau
                </button>

                <div>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Nom"
                    className="border border-slate-400 py-1 px-2 rounded-sm w-full"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-300 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-1 px-3 border rounded-sm flex items-center justify-center gap-1 hover:cursor-pointer
                    ${
                      op === Operation.CREATE
                        ? "border-blue-400 text-blue-400"
                        : op === Operation.UPDATE
                        ? "border-green-400 text-green-400"
                        : op === Operation.DELETE
                        ? "border-red-300 text-red-300"
                        : "hidden"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner /> Processing...
                    </>
                  ) : (
                    <>
                      {op === Operation.CREATE && <LucidePlus size={16} />}
                      {op === Operation.UPDATE && <Pencil size={16} />}
                      {op === Operation.DELETE && <LucideTrash2 size={16} />}
                      {op === Operation.CREATE && "Ajouter"}
                      {op === Operation.UPDATE && "Modifier"}
                      {op === Operation.DELETE && "Supprimer"}
                    </>
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Liste des utilisateurs */}
        <div className="border border-slate-200 p-3 rounded-md w-full">
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <ul>
              {sites.map((user) => (
                <li key={user.id} className="flex items-center gap-2 mb-1">
                  <button
                    disabled={isSubmitting}
                    onClick={() => {
                      setOp(Operation.DELETE);
                      setSelectedSite(user);
                    }}
                    className="border rounded-full p-1 border-slate-300  hover:bg-slate-200 hover:cursor-pointer"
                  >
                    <LucideTrash2 size={18} className="text-red-300" />
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => {
                      setOp(Operation.UPDATE);
                      setSelectedSite(user);
                    }}
                    className="border rounded-full p-1 border-slate-300  hover:bg-slate-200 hover:cursor-pointer"
                  >
                    <Pencil size={18} className="text-green-300" />
                  </button>

                  <span>{user.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
