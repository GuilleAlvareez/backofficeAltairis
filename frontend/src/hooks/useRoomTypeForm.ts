import { useState, useRef } from "react";

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
  const formRef = useRef<RoomTypeForm>({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    capacity: initial?.capacity ?? 2,
    pricePerNight: initial?.pricePerNight ?? "",
    active: initial?.active ?? true,
  });

  const [form, setForm] = useState<RoomTypeForm>(formRef.current);
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (field: keyof RoomTypeForm, value: any) => {
    formRef.current = { ...formRef.current, [field]: value };
    setForm(formRef.current);
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const f = formRef.current;

    if (!f.name.trim()) {
      newErrors.name = "El nombre de la habitación es obligatorio";
    }
    if (f.capacity < 1) {
      newErrors.capacity = "La capacidad debe ser al menos 1";
    }
    if (f.pricePerNight && Number(f.pricePerNight) <= 0) {
      newErrors.pricePerNight = "El precio debe ser mayor que 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { form, errors, setField, validate };
}
