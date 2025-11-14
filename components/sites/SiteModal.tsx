// components/sites/SiteModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SiteForm } from "./SiteForm";
import { SiteFormData } from "@/lib/validations/siteSchema";

interface SiteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: SiteFormData & { id?: string };
  onSubmit: (data: SiteFormData) => Promise<void>;
  isSubmitting: boolean;
  error?: string;
  title: string;
  description: string;
}

export function SiteModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
  error,
  title,
  description,
}: SiteModalProps) {
  const handleSubmit = async (data: SiteFormData) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <SiteForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
