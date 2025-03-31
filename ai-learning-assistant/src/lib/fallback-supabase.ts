// Fallback implementation for Supabase
// This will be used during build time or when the real Supabase module can't be loaded

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: { message: "Auth not available during build" } }),
    signInWithOAuth: async () => ({ error: { message: "Auth not available during build" } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: "Auth not available during build" } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    setSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    resetPasswordForEmail: async () => ({ error: null }),
    updateUser: async () => ({ data: { user: null }, error: null }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
        order: () => ({
          limit: () => ({
            order: () => ({
              range: () => ({
                data: null,
                error: null
              })
            })
          })
        })
      }),
      order: () => ({
        limit: () => ({
          data: null,
          error: null
        })
      }),
      data: null,
      error: null
    }),
    insert: async () => ({ error: { message: "Database not available during build" } }),
    update: async () => ({ error: { message: "Database not available during build" } }),
    upsert: async () => ({ error: { message: "Database not available during build" } }),
    delete: async () => ({ error: { message: "Database not available during build" } }),
  }),
  storage: {
    from: (bucket: string) => ({
      upload: async () => ({ data: null, error: { message: "Storage not available during build" } }),
      download: async () => ({ data: null, error: { message: "Storage not available during build" } }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
      list: async () => ({ data: [], error: null }),
      remove: async () => ({ error: null }),
    })
  },
  rpc: (fn: string, params: any) => ({
    data: null,
    error: { message: "RPC not available during build" }
  }),
};

// Also export common Supabase helper functions
export const createClientComponentClient = () => supabase;
export const createServerComponentClient = () => supabase;
export const createMiddlewareClient = () => supabase;

// Default export for module aliasing
export default { supabase, createClientComponentClient, createServerComponentClient, createMiddlewareClient }; 