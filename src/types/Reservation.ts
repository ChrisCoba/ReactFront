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
    Correo?: string;
    FechaInicio: string;
    Personas: number;
    DuracionHoldSegundos?: number;
    Turistas?: Tourist[];
}

export interface PreReservaResponse {
    holdId: string;
    preReservaId: string;
    fechaExpiracion: string;
    estado: string;
    mensaje: string;
}

export interface ConfirmReservaData {
    preReservaId: string;
    idPaquete: string;
    correo: string;
    turistas?: Tourist[];
}

export interface ReservaResponse {
    reservaId: number;
    codigo?: string;
    estado: string;
    uriFactura?: string;
}

// Legacy interfaces for backwards compatibility
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

