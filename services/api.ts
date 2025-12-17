
import { Service, User, Booking, EventItem } from '../types';
import { MOCK_SERVICES, MOCK_BOOKINGS, MOCK_USER, MOCK_EVENTS } from './mockData';
// import { supabase } from './supabase'; // Descomentar quando integrar

// CAMADA DE SERVIÇO (API)
// Atualmente usa Mock Data. Abaixo de cada função está o código comentado para Supabase.

const SIMULATE_DELAY = 600;

export const api = {
  // --- SERVICES ---
  getServices: async (): Promise<Service[]> => {
    // SUPABASE TODO:
    // const { data, error } = await supabase.from('services').select('*').eq('status', 'approved');
    // if (error) throw error;
    // return data as Service[];

    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SERVICES), SIMULATE_DELAY);
    });
  },

  getServiceById: async (id: string): Promise<Service | undefined> => {
    // SUPABASE TODO:
    // const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
    // return data as Service;

    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_SERVICES.find(s => s.id === id)), SIMULATE_DELAY);
    });
  },

  createService: async (service: Service): Promise<Service> => {
    // SUPABASE TODO:
    // const { data, error } = await supabase.from('services').insert([service]).select().single();
    // return data as Service;

    return new Promise((resolve) => {
      setTimeout(() => resolve(service), SIMULATE_DELAY);
    });
  },

  // --- BOOKINGS ---
  getBookings: async (): Promise<Booking[]> => {
    // SUPABASE TODO:
    // const { data } = await supabase.from('bookings').select('*');

    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_BOOKINGS), SIMULATE_DELAY);
    });
  },

  createBooking: async (booking: Booking): Promise<Booking> => {
    // SUPABASE TODO:
    // const { data } = await supabase.from('bookings').insert([booking]).select().single();

    return new Promise((resolve) => {
      setTimeout(() => resolve(booking), SIMULATE_DELAY);
    });
  },

  // --- USERS & AUTH ---
  getCurrentUser: async (): Promise<User> => {
    // SUPABASE TODO:
    // const { data: { user } } = await supabase.auth.getUser();
    // if (!user) return null;
    // const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    // return profile;

    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_USER), SIMULATE_DELAY);
    });
  },

  // --- EVENTS ---
  getUserEvents: async (userId: string): Promise<EventItem[]> => {
    // SUPABASE TODO:
    // const { data } = await supabase.from('events').select('*').eq('organizer_id', userId);

    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_EVENTS.filter(e => e.organizerId === userId)), SIMULATE_DELAY);
    });
  }
};
