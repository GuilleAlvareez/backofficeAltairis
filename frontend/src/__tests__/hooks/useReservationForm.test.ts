import { renderHook, act } from "@testing-library/react";
import { useReservationForm } from "@/hooks/useReservationForm";

describe("useReservationForm", () => {
  it("debería inicializarse con el formulario vacío", () => {
    const { result } = renderHook(() => useReservationForm());
    expect(result.current.form.guestName).toBe("");
    expect(result.current.form.guestEmail).toBe("");
    expect(result.current.form.numberOfRooms).toBe(1);
    expect(result.current.form.status).toBe("CONFIRMED");
  });

  it("debería actualizar un campo correctamente", () => {
    const { result } = renderHook(() => useReservationForm());
    act(() => {
      result.current.setField("guestName", "Carlos Martínez");
    });
    expect(result.current.form.guestName).toBe("Carlos Martínez");
  });

  it("debería fallar si el nombre está vacío", () => {
    const { result } = renderHook(() => useReservationForm());
    let isValid: boolean;
    act(() => {
      isValid = result.current.validate();
    });
    expect(isValid!).toBe(false);
    expect(result.current.errors.guestName).toBe(
      "El nombre del huésped es obligatorio",
    );
  });

  it("debería fallar si el email es inválido", () => {
    const { result } = renderHook(() => useReservationForm());
    act(() => {
      result.current.setField("guestName", "Carlos Martínez");
      result.current.setField("guestEmail", "correo-invalido");
      result.current.validate();
    });
    expect(result.current.errors.guestEmail).toBe(
      "El email no tiene un formato válido",
    );
  });

  it("debería fallar si el check-out es anterior al check-in", () => {
    const { result } = renderHook(() => useReservationForm());
    act(() => {
      result.current.setField("guestName", "Carlos Martínez");
      result.current.setField("guestEmail", "carlos@email.com");
      result.current.setField("checkIn", "2027-06-10");
      result.current.setField("checkOut", "2027-06-05");
      result.current.validate();
    });
    expect(result.current.errors.checkOut).toBe(
      "El check-out debe ser posterior al check-in",
    );
  });

  it("debería fallar si el check-in está en el pasado", () => {
    const { result } = renderHook(() => useReservationForm());
    act(() => {
      result.current.setField("guestName", "Carlos Martínez");
      result.current.setField("guestEmail", "carlos@email.com");
      result.current.setField("checkIn", "2020-01-01");
      result.current.setField("checkOut", "2020-01-05");
      result.current.validate();
    });
    expect(result.current.errors.checkIn).toBe(
      "El check-in no puede ser en el pasado",
    );
  });

  it("debería ser válido con todos los campos correctos", () => {
    const { result } = renderHook(() => useReservationForm());
    let isValid: boolean;
    act(() => {
      result.current.setField("guestName", "Carlos Martínez");
      result.current.setField("guestEmail", "carlos@email.com");
      result.current.setField("checkIn", "2027-06-10");
      result.current.setField("checkOut", "2027-06-15");
      isValid = result.current.validate();
    });
    expect(isValid!).toBe(true);
    expect(Object.keys(result.current.errors).length).toBe(0);
  });

  it("debería limpiar el formulario al hacer reset", () => {
    const { result } = renderHook(() => useReservationForm());
    act(() => {
      result.current.setField("guestName", "Carlos Martínez");
      result.current.reset();
    });
    expect(result.current.form.guestName).toBe("");
  });

  it("debería limpiar el error de un campo al corregirlo", () => {
    const { result } = renderHook(() => useReservationForm());
    act(() => {
      result.current.validate();
    });
    expect(result.current.errors.guestName).toBeDefined();
    act(() => {
      result.current.setField("guestName", "Carlos Martínez");
    });
    expect(result.current.errors.guestName).toBeUndefined();
  });
});
