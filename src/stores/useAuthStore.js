import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/db/supabase'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Sign up
      signUp: async (email, password, name, mobile) => {
        set({ isLoading: true, error: null })
        try {
          // Create user in Supabase Auth with metadata
          // The trigger will automatically create the user record in the users table
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
                phone: mobile
              }
            }
          })

          if (error) throw error

          if (data.user) {
            // Don't manually insert into users table - the trigger handles it
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            })
          }
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          })
          throw error
        }
      },

      // Sign in
      signIn: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })

          if (error) throw error

          if (data.user) {
            // Get user details from users table
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('email', email)
              .single()

            set({
              user: { ...data.user, ...userData },
              isAuthenticated: true,
              isLoading: false
            })
          }
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          })
          throw error
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true })
        try {
          await supabase.auth.signOut()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          })
        }
      },

      // Get current session
      getCurrentSession: async () => {
        set({ isLoading: true })
        try {
          const { data: { session } } = await supabase.auth.getSession()
          
          if (session?.user) {
            const { data: userData } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single()

            set({
              user: { ...session.user, ...userData },
              isAuthenticated: true,
              isLoading: false
            })
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false
            })
          }
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          })
        }
      },

      // Clear error
      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
)

export default useAuthStore 