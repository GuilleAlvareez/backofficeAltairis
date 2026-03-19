import { useState } from "react";

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

const initialForm: ReservationForm = {
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
  const [form, setForm] = useState<ReservationForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (field: keyof ReservationForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!form.guestName.trim()) {
      newErrors.guestName = "El nombre del huésped es obligatorio";
    } else if (form.guestName.trim().length < 3) {
      newErrors.guestName = "El nombre debe tener al menos 3 caracteres";
    }

    if (!form.guestEmail.trim()) {
      newErrors.guestEmail = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.guestEmail)) {
      newErrors.guestEmail = "El email no tiene un formato válido";
    }

    if (!form.checkIn) {
      newErrors.checkIn = "La fecha de check-in es obligatoria";
    } else if (new Date(form.checkIn) < today) {
      newErrors.checkIn = "El check-in no puede ser en el pasado";
    }

    if (!form.checkOut) {
      newErrors.checkOut = "La fecha de check-out es obligatoria";
    } else if (
      form.checkIn &&
      new Date(form.checkOut) <= new Date(form.checkIn)
    ) {
      newErrors.checkOut = "El check-out debe ser posterior al check-in";
    }

    if (form.numberOfRooms < 1) {
      newErrors.numberOfRooms = "Debe haber al menos 1 habitación";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setForm(initialForm);
    setErrors({});
  };

  return { form, errors, setField, validate, reset };
}
