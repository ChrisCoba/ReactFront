// Reservation type definitions
export interface Reservation {
    IdReserva: string;
    IdPaquete: string;
    BookingUserId: string;
    FechaInicio: string;
    Estado: string;
    MetodoPago?: string;
    Turistas?: Tourist[];
    Total?: number;
}

export interface HoldData {
    IdPaquete: string;
    BookingUserId: string;
    FechaInicio: string;
    Personas: number;
    DuracionHoldSegundos: number;
}

export interface HoldResponse {
    HoldId: string;
    CuposDisponibles?: number;
    Exito: boolean;
    Mensaje?: string;
}

export interface BookData {
    IdPaquete: string;
    HoldId: string;
    BookingUserId: string;
    MetodoPago: string;
    Turistas: Tourist[];
}

export interface Tourist {
    Nombre: string;
    Apellido: string;
    Identificacion: string;
    TipoIdentificacion: string;
}
