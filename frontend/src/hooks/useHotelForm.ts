import { useState, useRef } from "react";

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
  const formRef = useRef<HotelForm>({
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

  const [form, setForm] = useState<HotelForm>(formRef.current);
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (field: keyof HotelForm, value: any) => {
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
      newErrors.name = "El nombre del hotel es obligatorio";
    }
    if (!f.country.trim()) {
      newErrors.country = "El país es obligatorio";
    }
    if (!f.city.trim()) {
      newErrors.city = "La ciudad es obligatoria";
    }
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      newErrors.email = "El email no tiene un formato válido";
    }
    if (f.stars < 1 || f.stars > 5) {
      newErrors.stars = "Las estrellas deben estar entre 1 y 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { form, errors, setField, validate };
}
