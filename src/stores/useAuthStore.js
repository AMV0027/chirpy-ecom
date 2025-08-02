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
      signUp: async (email, password, fullName, phone) => {
        set({ isLoading: true, error: null })
        try {
          // First, check if user already exists in the users table
          const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('id, email')
            .eq('email', email)
            .single()

          if (existingUser) {
            throw new Error('An account with this email already exists. Please sign in instead.')
          }

          // Create the user in Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone: phone
              }
            }
          })

          if (authError) throw authError

          if (authData.user) {
            // Then, create a record in the users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .insert([
                {
                  name: fullName,
                  email: email,
                  mobile: phone,
                  avatar_url: null
                }
              ])
              .select()
              .single()

            if (userError) {
              // If user table insert fails, we should clean up the auth user
              await supabase.auth.signOut()
              
              // Check if it's a unique constraint violation
              if (userError.code === '23505' && userError.message.includes('users_email_key')) {
                throw new Error('An account with this email already exists. Please sign in instead.')
              }
              
              throw userError
            }

            set({
              user: { ...authData.user, ...userData },
              isAuthenticated: true,
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
            // Fetch additional user details from the users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('email', email)
              .single()

            if (userError) {
              console.warn('Could not fetch user details:', userError)
              // Still allow login even if user details fetch fails
              set({
                user: data.user,
                isAuthenticated: true,
                isLoading: false
              })
            } else {
              set({
                user: { ...data.user, ...userData },
                isAuthenticated: true,
                isLoading: false
              })
            }
          }
        } catch (error) {
          set({
            error: error.message,
            isLoading: false
          })
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true })
        try {
          const { error } = await supabase.auth.signOut()
          if (error) throw error

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
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) throw error

          if (session?.user) {
            // Fetch additional user details from the users table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single()

            if (userError) {
              console.warn('Could not fetch user details:', userError)
              set({
                user: session.user,
                isAuthenticated: true,
                isLoading: false
              })
            } else {
              set({
                user: { ...session.user, ...userData },
                isAuthenticated: true,
                isLoading: false
              })
            }
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

      // Update user profile
      updateProfile: async (updates) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await supabase.auth.updateUser({
            data: updates
          })

          if (error) throw error

          // Also update the users table
          if (data.user) {
            const { error: userError } = await supabase
              .from('users')
              .update(updates)
              .eq('email', data.user.email)

            if (userError) {
              console.warn('Could not update user details:', userError)
            }
          }

          set({
            user: data.user,
            isLoading: false
          })
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