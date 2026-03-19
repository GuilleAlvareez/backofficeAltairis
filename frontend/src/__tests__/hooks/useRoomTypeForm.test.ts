import { renderHook, act } from "@testing-library/react";
import { useRoomTypeForm } from "@/hooks/useRoomTypeForm";

describe("useRoomTypeForm", () => {
  it("debería inicializarse con valores por defecto", () => {
    const { result } = renderHook(() => useRoomTypeForm());
    expect(result.current.form.name).toBe("");
    expect(result.current.form.capacity).toBe(2);
    expect(result.current.form.active).toBe(true);
    expect(result.current.form.pricePerNight).toBe("");
  });

  it("debería inicializarse con valores existentes al editar", () => {
    const roomType = {
      name: "Suite Junior",
      capacity: 2,
      pricePerNight: 650,
      active: true,
    };
    const { result } = renderHook(() => useRoomTypeForm(roomType));
    expect(result.current.form.name).toBe("Suite Junior");
    expect(result.current.form.capacity).toBe(2);
    expect(result.current.form.pricePerNight).toBe(650);
  });

  it("debería actualizar un campo correctamente", () => {
    const { result } = renderHook(() => useRoomTypeForm());
    act(() => {
      result.current.setField("name", "Suite Deluxe");
    });
    expect(result.current.form.name).toBe("Suite Deluxe");
  });

  it("debería fallar si el nombre está vacío", () => {
    const { result } = renderHook(() => useRoomTypeForm());
    let isValid: boolean;
    act(() => {
      isValid = result.current.validate();
    });
    expect(isValid!).toBe(false);
    expect(result.current.errors.name).toBe(
      "El nombre de la habitación es obligatorio",
    );
  });

  it("debería fallar si la capacidad es menor que 1", () => {
    const { result } = renderHook(() => useRoomTypeForm());
    act(() => {
      result.current.setField("name", "Suite Deluxe");
      result.current.setField("capacity", 0);
      result.current.validate();
    });
    expect(result.current.errors.capacity).toBe(
      "La capacidad debe ser al menos 1",
    );
  });

  it("debería fallar si el precio es menor o igual a 0", () => {
    const { result } = renderHook(() => useRoomTypeForm());
    act(() => {
      result.current.setField("name", "Suite Deluxe");
      result.current.setField("pricePerNight", "-10");
      result.current.validate();
    });
    expect(result.current.errors.pricePerNight).toBe(
      "El precio debe ser mayor que 0",
    );
  });

  it("debería ser válido si el precio está vacío", () => {
    const { result } = renderHook(() => useRoomTypeForm());
    let isValid: boolean;
    act(() => {
      result.current.setField("name", "Suite Deluxe");
      isValid = result.current.validate();
    });
    expect(isValid!).toBe(true);
    expect(result.current.errors.pricePerNight).toBeUndefined();
  });

  it("debería ser válido con todos los campos correctos", () => {
    const { result } = renderHook(() => useRoomTypeForm());
    let isValid: boolean;
    act(() => {
      result.current.setField("name", "Suite Deluxe");
      result.current.setField("capacity", 2);
      result.current.setField("pricePerNight", "650");
      isValid = result.current.validate();
    });
    expect(isValid!).toBe(true);
    expect(Object.keys(result.current.errors).length).toBe(0);
  });

  it("debería limpiar el error de un campo al corregirlo", () => {
    const { result } = renderHook(() => useRoomTypeForm());
    act(() => {
      result.current.validate();
    });
    expect(result.current.errors.name).toBeDefined();
    act(() => {
      result.current.setField("name", "Suite Deluxe");
    });
    expect(result.current.errors.name).toBeUndefined();
  });
});
