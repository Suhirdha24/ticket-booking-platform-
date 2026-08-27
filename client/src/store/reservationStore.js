import { create } from 'zustand';
import api from '../api/client.js';

export const useReservationStore = create((set, get) => ({
  selectedSeats: [],
  activeReservation: null,
  remainingSeconds: 0,
  isHolding: false,

  toggleSeatSelection: (seat) => {
    const { selectedSeats, activeReservation } = get();
    // Cannot modify selection if already holding an active reservation lock
    if (activeReservation) return;

    const exists = selectedSeats.some((s) => s._id === seat._id);
    if (exists) {
      set({ selectedSeats: selectedSeats.filter((s) => s._id !== seat._id) });
    } else {
      if (selectedSeats.length >= 8) {
        throw new Error('Maximum 8 seats can be selected per reservation.');
      }
      set({ selectedSeats: [...selectedSeats, seat] });
    }
  },

  clearSelectedSeats: () => {
    set({ selectedSeats: [] });
  },

  createReservation: async (eventId) => {
    const { selectedSeats } = get();
    if (selectedSeats.length === 0) {
      throw new Error('Please select at least one seat to reserve.');
    }

    set({ isHolding: true });
    try {
      const res = await api.post('/reservations', {
        eventId,
        seatIds: selectedSeats.map((s) => s._id),
      });

      const data = res.data.data;
      const expiresAt = new Date(data.expiresAt);
      const remainingMs = Math.max(0, expiresAt.getTime() - Date.now());

      set({
        activeReservation: data,
        remainingSeconds: Math.floor(remainingMs / 1000),
        isHolding: false,
      });

      return data;
    } catch (error) {
      set({ isHolding: false });
      throw error;
    }
  },

  fetchReservation: async (reservationId) => {
    try {
      const res = await api.get(`/reservations/${reservationId}`);
      const reservation = res.data.data.reservation;

      if (reservation.status === 'EXPIRED') {
        set({ activeReservation: null, remainingSeconds: 0 });
        return null;
      }

      set({
        activeReservation: {
          reservationId: reservation._id,
          expiresAt: reservation.expiresAt,
          seats: reservation.seats,
          event: reservation.event,
        },
        remainingSeconds: reservation.remainingSeconds,
      });

      return reservation;
    } catch (err) {
      set({ activeReservation: null, remainingSeconds: 0 });
      return null;
    }
  },

  tick: () => {
    const { remainingSeconds, activeReservation } = get();
    if (!activeReservation) return;

    if (remainingSeconds <= 1) {
      set({ activeReservation: null, remainingSeconds: 0 });
    } else {
      set({ remainingSeconds: remainingSeconds - 1 });
    }
  },

  clearReservation: () => {
    set({ activeReservation: null, selectedSeats: [], remainingSeconds: 0 });
  },
}));
