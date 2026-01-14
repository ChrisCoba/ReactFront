import { gql } from '@apollo/client';

// Fragments
const PACKAGE_FIELDS = gql`
  fragment PackageFields on Package {
    id
    nombre
    ciudad
    pais
    precio
    duracion
    tipoActividad
    imagen
    activo
    capacidad
  }
`;

const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    email
    activo
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
  query GetUserDashboard($userId: Int!) {
    user(id: $userId) {
      ...UserFields
      totalSpent
      bookings(limit: 50) {
        id
        codigo
        fechaReserva
        fechaInicio
        total
        estado
        facturaId
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
      recentBookings {
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
      topPackages {
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
  query GetUsersList($page: Int, $limit: Int) {
    users(page: $page, limit: $limit) {
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
      fechaInicio
      total
      estado
      facturaId
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
