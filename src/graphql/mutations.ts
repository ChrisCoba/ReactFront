import { gql } from '@apollo/client';

// Mutation to create a new reservation (pending state)
export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      success
      reservationId
      message
    }
  }
`;

// Mutation to pay for a reservation and confirm it
export const PAY_RESERVATION = gql`
  mutation PayReservation($input: PayReservationInput!) {
    payReservation(input: $input) {
      success
      reservationId
      message
    }
  }
`;

// Mutation to cancel a reservation
export const CANCEL_RESERVATION = gql`
  mutation CancelReservation($input: CancelReservationInput!) {
    cancelReservation(input: $input) {
      success
      message
    }
  }
`;

// Mutation to update user profile
export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($input: UpdateUserProfileInput!) {
    updateUserProfile(input: $input) {
      id
      profile {
        nombre
        apellido
        telefono
      }
    }
  }
`;
