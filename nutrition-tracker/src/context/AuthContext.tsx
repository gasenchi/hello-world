import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { supabase } from '../lib/supabase'

type AuthContextType = {
  loading: boolean
  user: any | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({ loading: true, user: null, signOut: async () => {} })

export function AuthProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    void init()
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  const value = useMemo(() => ({
    loading,
    user,
    signOut: async () => { await supabase.auth.signOut() },
  }), [loading, user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

