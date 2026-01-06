import { gql } from '@apollo/client';

// Fragments
const PACKAGE_FIELDS = gql`
  fragment PackageFields on Package {
    id
    nombre
    ciudad
    pais
    descripcion
    precio
    duracion
    imagen
    fechaInicio
    tipoActividad
    cuposDisponibles
  }
`;

const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    email
    profile {
      nombre
      apellido
      telefono
      fechaRegistro
    }
  }
`;

// Queries
export const GET_PACKAGES = gql`
  ${PACKAGE_FIELDS}
  query GetPackages {
    packages {
      ...PackageFields
    }
  }
`;

export const GET_PACKAGE_BY_ID = gql`
  ${PACKAGE_FIELDS}
  query GetPackageById($id: String!) {
    packageInput(id: $id) {
      ...PackageFields
    }
  }
`;

export const GET_USER_DASHBOARD = gql`
  ${USER_FIELDS}
  query GetUserDashboard($userId: String!) {
    user(id: $userId) {
      ...UserFields
      totalSpent
      bookings(limit: 10) {
        id
        codigo
        fechaReserva
        total
        estado
        package {
          nombre
          ciudad
          precio
          imagen
        }
      }
    }
  }
`;

export const GET_ADMIN_DASHBOARD = gql`
  query GetAdminDashboard {
    dashboardStats {
      totalUsers
      totalReservations
      totalRevenue
      recentBookings(limit: 10) {
        id
        codigo
        fechaReserva
        total
        estado
        cliente {
          email
          profile {
            nombre
            apellido
          }
        }
        package {
          nombre
        }
      }
      topPackages(limit: 5) {
        nombre
        ciudad
        precio
        duracion
        imagen
      }
    }
  }
`;

export const GET_USERS_LIST = gql`
  ${USER_FIELDS}
  query GetUsersList($limit: Int) {
    users(limit: $limit) {
      ...UserFields
      totalSpent
    }
  }
`;

export const GET_RESERVATIONS_LIST = gql`
  query GetReservationsList($limit: Int) {
    reservations(limit: $limit) {
      id
      codigo
      fechaReserva
      total
      estado
      cliente {
        email
        profile {
          nombre
          apellido
        }
      }
      package {
        nombre
        ciudad
      }
    }
  }
`;
