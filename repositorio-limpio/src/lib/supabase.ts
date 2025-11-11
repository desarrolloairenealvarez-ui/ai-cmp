import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://weofljcxrbtjdirzzhpf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indlb2ZsamN4cmJ0amRpcnp6aHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Nzk5NTcsImV4cCI6MjA3ODM1NTk1N30.jbvCKEXMzSt5ZSeIq9RO8aIWbSXjLeFCMvLNLDjRkCQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
