import { useState } from "react";

interface RoomTypeForm {
  name: string;
  description: string;
  capacity: number;
  pricePerNight: string;
  active: boolean;
}

interface FormErrors {
  name?: string;
  capacity?: string;
  pricePerNight?: string;
}

export function useRoomTypeForm(initial?: any) {
  const [form, setForm] = useState<RoomTypeForm>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    capacity: initial?.capacity ?? 2,
    pricePerNight: initial?.pricePerNight ?? "",
    active: initial?.active ?? true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (field: keyof RoomTypeForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre de la habitación es obligatorio";
    }

    if (form.capacity < 1) {
      newErrors.capacity = "La capacidad debe ser al menos 1";
    }

    if (form.pricePerNight && Number(form.pricePerNight) <= 0) {
      newErrors.pricePerNight = "El precio debe ser mayor que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { form, errors, setField, validate };
}
