import { useState, useRef } from "react";

interface ReservationForm {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  numberOfRooms: number;
  notes: string;
  status: string;
}

interface FormErrors {
  guestName?: string;
  guestEmail?: string;
  checkIn?: string;
  checkOut?: string;
  numberOfRooms?: string;
}

const initialValues: ReservationForm = {
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  checkIn: "",
  checkOut: "",
  numberOfRooms: 1,
  notes: "",
  status: "CONFIRMED",
};

export function useReservationForm() {
  const formRef = useRef<ReservationForm>({ ...initialValues });

  const [form, setForm] = useState<ReservationForm>(formRef.current);
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (field: keyof ReservationForm, value: any) => {
    formRef.current = { ...formRef.current, [field]: value };
    setForm(formRef.current);
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const f = formRef.current;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!f.guestName.trim()) {
      newErrors.guestName = "El nombre del huésped es obligatorio";
    }

    if (!f.guestEmail.trim()) {
      newErrors.guestEmail = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.guestEmail)) {
      newErrors.guestEmail = "El email no tiene un formato válido";
    }

    if (!f.checkIn) {
      newErrors.checkIn = "La fecha de check-in es obligatoria";
    } else if (new Date(f.checkIn) < today) {
      newErrors.checkIn = "El check-in no puede ser en el pasado";
    }

    if (!f.checkOut) {
      newErrors.checkOut = "La fecha de check-out es obligatoria";
    } else if (f.checkIn && new Date(f.checkOut) <= new Date(f.checkIn)) {
      newErrors.checkOut = "El check-out debe ser posterior al check-in";
    }

    if (f.numberOfRooms < 1) {
      newErrors.numberOfRooms = "Debe haber al menos 1 habitación";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    formRef.current = { ...initialValues };
    setForm(formRef.current);
    setErrors({});
  };

  return { form, errors, setField, validate, reset };
}
