import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  avatarUrl: string | null;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;

  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{
    error: string | null;
    needsEmailConfirmation: boolean;
  }>;

  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const convertUser = (
  supabaseUser: any,
  profile?: any
): User => ({
  id: supabaseUser.id,

  username:
    profile?.username ||
    supabaseUser.user_metadata?.username ||
    supabaseUser.email?.split('@')[0] ||
    'User',

  email: supabaseUser.email || '',

  createdAt: supabaseUser.created_at,

  avatarUrl:
    profile?.avatar_url ||
    supabaseUser.user_metadata?.avatar_url ||
    null,

  role: profile?.role === 'admin' ? 'admin' : 'user',
});

async function getProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('username, avatar_url, role')
    .eq('id', userId)
    .maybeSingle();

  return data;
}

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async (supabaseUser: any) => {
    if (!supabaseUser) {
      setUser(null);
      return;
    }

    const profile = await getProfile(supabaseUser.id);

    setUser(convertUser(supabaseUser, profile));
  };

  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();

    await loadUser(data.user);
  };

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      /*
       * Password recovery link contains:
       * #type=recovery
       *
       * Keep the recovery hash and move the user
       * directly to /reset-password.
       */
      const isRecovery =
        window.location.hash.includes('type=recovery');

      if (isRecovery) {
        window.location.replace(
          `/reset-password${window.location.hash}`
        );

        return;
      }

      if (data.session?.user) {
        await loadUser(data.session.user);
      }

      if (mounted) {
        setLoading(false);
      }
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {

        /*
         * Supabase fires PASSWORD_RECOVERY
         * when the reset link is opened.
         */
        if (event === 'PASSWORD_RECOVERY') {
          setUser(null);
          setLoading(false);

          window.location.replace(
            `/reset-password${window.location.hash}`
          );

          return;
        }

        if (session?.user) {
          await loadUser(session.user);
        } else {
          setUser(null);
        }

        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ) => {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    return {
      error: error ? error.message : null,
    };
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            username,
          },
        },
      });

    if (error) {
      return {
        error: error.message,
        needsEmailConfirmation: false,
      };
    }

    if (
      data.user &&
      data.user.identities &&
      data.user.identities.length === 0
    ) {
      return {
        error: 'Email already exists. Please login.',
        needsEmailConfirmation: false,
      };
    }

    return {
      error: null,

      needsEmailConfirmation:
        !!data.user && !data.session,
    };
  };

  const logout = async () => {
    await supabase.auth.signOut();

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
}