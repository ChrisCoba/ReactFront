// Tour/Package type definitions
export interface Tour {
    IdPaquete: string;
    Nombre: string;
    Descripcion?: string;
    Ciudad: string;
    Pais: string;
    Duracion: number;
    PrecioActual: number;
    ImagenUrl?: string;
    TipoActividad?: string;
    FechaInicio?: string;
    FechaFin?: string;
    CuposMaximos?: number;
    CuposDisponibles?: number;
}

export interface SearchFilters {
    city?: string;
    tipoActividad?: string;
    precioMax?: number;
    duration?: string;
    fechainicio?: string;
}

export enum TourType {
    Adventure = 'Aventura',
    Cultural = 'Cultural',
    Relaxation = 'Relajación',
    Sports = 'Deportes',
    Nature = 'Naturaleza',
    City = 'Ciudad'
}
