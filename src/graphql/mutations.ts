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
