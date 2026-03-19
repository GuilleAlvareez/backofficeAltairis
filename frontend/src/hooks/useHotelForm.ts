import { useState } from "react";

interface HotelForm {
  name: string;
  country: string;
  city: string;
  address: string;
  stars: number;
  category: string;
  phone: string;
  email: string;
  active: boolean;
}

interface FormErrors {
  name?: string;
  country?: string;
  city?: string;
  email?: string;
  stars?: string;
}

export function useHotelForm(initial?: any) {
  const [form, setForm] = useState<HotelForm>({
    name: initial?.name ?? "",
    country: initial?.country ?? "",
    city: initial?.city ?? "",
    address: initial?.address ?? "",
    stars: initial?.stars ?? 5,
    category: initial?.category ?? "",
    phone: initial?.phone ?? "",
    email: initial?.email ?? "",
    active: initial?.active ?? true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (field: keyof HotelForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "El nombre del hotel es obligatorio";
    }

    if (!form.country.trim()) {
      newErrors.country = "El país es obligatorio";
    }

    if (!form.city.trim()) {
      newErrors.city = "La ciudad es obligatoria";
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "El email no tiene un formato válido";
    }

    if (form.stars < 1 || form.stars > 5) {
      newErrors.stars = "Las estrellas deben estar entre 1 y 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { form, errors, setField, validate };
}
