import { renderHook, act } from "@testing-library/react";
import { useHotelForm } from "@/hooks/useHotelForm";

describe("useHotelForm", () => {
  it("debería inicializarse con valores por defecto", () => {
    const { result } = renderHook(() => useHotelForm());
    expect(result.current.form.name).toBe("");
    expect(result.current.form.country).toBe("");
    expect(result.current.form.city).toBe("");
    expect(result.current.form.stars).toBe(5);
    expect(result.current.form.active).toBe(true);
  });

  it("debería inicializarse con valores existentes al editar", () => {
    const hotel = {
      name: "Hotel Ritz",
      country: "España",
      city: "Madrid",
      stars: 5,
      active: true,
    };
    const { result } = renderHook(() => useHotelForm(hotel));
    expect(result.current.form.name).toBe("Hotel Ritz");
    expect(result.current.form.country).toBe("España");
    expect(result.current.form.city).toBe("Madrid");
  });

  it("debería actualizar un campo correctamente", () => {
    const { result } = renderHook(() => useHotelForm());
    act(() => {
      result.current.setField("name", "Hotel Arts Barcelona");
    });
    expect(result.current.form.name).toBe("Hotel Arts Barcelona");
  });

  it("debería fallar si el nombre está vacío", () => {
    const { result } = renderHook(() => useHotelForm());
    let isValid: boolean;
    act(() => {
      isValid = result.current.validate();
    });
    expect(isValid!).toBe(false);
    expect(result.current.errors.name).toBe(
      "El nombre del hotel es obligatorio",
    );
  });

  it("debería fallar si el país está vacío", () => {
    const { result } = renderHook(() => useHotelForm());
    act(() => {
      result.current.setField("name", "Hotel Arts");
      result.current.validate();
    });
    expect(result.current.errors.country).toBe("El país es obligatorio");
  });

  it("debería fallar si la ciudad está vacía", () => {
    const { result } = renderHook(() => useHotelForm());
    act(() => {
      result.current.setField("name", "Hotel Arts");
      result.current.setField("country", "España");
      result.current.validate();
    });
    expect(result.current.errors.city).toBe("La ciudad es obligatoria");
  });

  it("debería fallar si el email tiene formato inválido", () => {
    const { result } = renderHook(() => useHotelForm());
    act(() => {
      result.current.setField("name", "Hotel Arts");
      result.current.setField("country", "España");
      result.current.setField("city", "Barcelona");
      result.current.setField("email", "correo-invalido");
      result.current.validate();
    });
    expect(result.current.errors.email).toBe(
      "El email no tiene un formato válido",
    );
  });

  it("debería ser válido si el email está vacío", () => {
    const { result } = renderHook(() => useHotelForm());
    let isValid: boolean;
    act(() => {
      result.current.setField("name", "Hotel Arts");
      result.current.setField("country", "España");
      result.current.setField("city", "Barcelona");
      isValid = result.current.validate();
    });
    expect(isValid!).toBe(true);
    expect(result.current.errors.email).toBeUndefined();
  });

  it("debería fallar si las estrellas están fuera de rango", () => {
    const { result } = renderHook(() => useHotelForm());
    act(() => {
      result.current.setField("name", "Hotel Arts");
      result.current.setField("country", "España");
      result.current.setField("city", "Barcelona");
      result.current.setField("stars", 6);
      result.current.validate();
    });
    expect(result.current.errors.stars).toBe(
      "Las estrellas deben estar entre 1 y 5",
    );
  });

  it("debería ser válido con todos los campos correctos", () => {
    const { result } = renderHook(() => useHotelForm());
    let isValid: boolean;
    act(() => {
      result.current.setField("name", "Hotel Arts Barcelona");
      result.current.setField("country", "España");
      result.current.setField("city", "Barcelona");
      result.current.setField("email", "info@hotelarts.com");
      result.current.setField("stars", 5);
      isValid = result.current.validate();
    });
    expect(isValid!).toBe(true);
    expect(Object.keys(result.current.errors).length).toBe(0);
  });

  it("debería limpiar el error de un campo al corregirlo", () => {
    const { result } = renderHook(() => useHotelForm());
    act(() => {
      result.current.validate();
    });
    expect(result.current.errors.name).toBeDefined();
    act(() => {
      result.current.setField("name", "Hotel Arts");
    });
    expect(result.current.errors.name).toBeUndefined();
  });
});
