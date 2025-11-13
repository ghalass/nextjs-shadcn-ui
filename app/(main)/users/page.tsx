"use client";

import { useUsers } from "@/hooks/useUsers";
import { LucidePlus, LucideTrash2, Pencil } from "lucide-react";
import { User } from "@/lib/types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Yup from "@/lib/yupFr";
import React from "react";
import { Operation } from "@/lib/enums";
import Spinner from "@/components/Spinner";

export default function UsersPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { usersQuery, createUser, updateUser, deleteUser } = useUsers();
  const [op, setOp] = React.useState<Operation>(Operation.READ);
  const [selectedUser, setSelectedUser] = React.useState<Partial<User>>({});

  // Validation dynamique selon l'opération
  const getValidationSchema = (operation: Operation) => {
    return Yup.object({
      name: Yup.string().required().label("Nom"),
      email: Yup.string().email().required().label("Addresse Email"),
      password:
        operation === Operation.CREATE
          ? Yup.string().required().label("Mot de passe")
          : Yup.string().label("Mot de passe"), // Optionnel pour UPDATE/DELETE
      role: Yup.string().required().label("Rôle"),
    });
  };

  const initialValues: Partial<User> = {
    email: "",
    password: "",
    name: "",
    role: "",
  };

  const formValues =
    op === Operation.UPDATE || op === Operation.DELETE
      ? {
          email: selectedUser.email ?? "",
          name: selectedUser.name ?? "",
          password: selectedUser.password ?? "",
          role: selectedUser.role ?? "",
        }
      : initialValues;

  // À l'intérieur de UsersPage, avant le return
  const handleFormSubmit = async (
    values: Partial<User>,
    resetForm: () => void
  ) => {
    try {
      setIsSubmitting(true); // ← début de soumission

      switch (op) {
        case Operation.CREATE:
          await createUser.mutateAsync({
            name: values.name!,
            email: values.email!,
            password: values.password!,
            role: values.role!,
          });
          break;

        case Operation.UPDATE:
          if (!selectedUser.id) return;
          await updateUser.mutateAsync({
            id: selectedUser.id,
            name: values.name!,
            email: values.email!,
            password: values.password ?? "",
            role: values.role!,
          });
          break;

        case Operation.DELETE:
          if (!selectedUser.id) return;
          await deleteUser.mutateAsync({ id: selectedUser.id });
          break;
      }

      // Réinitialise le formulaire et l'état
      if (op === Operation.DELETE) {
        resetForm();
        setOp(Operation.READ);
        setSelectedUser({});
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
                    setSelectedUser({});
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

                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border border-slate-400 py-1 px-2 rounded-sm w-full"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-300 text-sm"
                  />
                </div>

                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    className="border border-slate-400 py-1 px-2 rounded-sm w-full"
                    disabled={isSubmitting}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-300 text-sm"
                  />
                </div>

                <div>
                  <Field
                    as="select"
                    name="role"
                    className="border border-slate-400 py-1 px-2 rounded-sm w-full"
                    disabled={isSubmitting}
                  >
                    <option value="">Rôle</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                    <option value="USER">USER</option>
                  </Field>
                  <ErrorMessage
                    name="role"
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
          {usersQuery.isLoading ? (
            <div>Chargement...</div>
          ) : (
            <ul>
              {usersQuery.data?.map((user) => (
                <li key={user.id} className="flex items-center gap-2 mb-1">
                  <button
                    disabled={isSubmitting}
                    onClick={() => {
                      setOp(Operation.DELETE);
                      setSelectedUser(user);
                    }}
                    className="border rounded-full p-1 border-slate-300  hover:bg-slate-200 hover:cursor-pointer"
                  >
                    <LucideTrash2 size={18} className="text-red-300" />
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => {
                      setOp(Operation.UPDATE);
                      setSelectedUser(user);
                    }}
                    className="border rounded-full p-1 border-slate-300  hover:bg-slate-200 hover:cursor-pointer"
                  >
                    <Pencil size={18} className="text-green-300" />
                  </button>

                  <span>
                    {user.name} {user.email} ({user.role})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
