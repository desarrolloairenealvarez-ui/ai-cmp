import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dkadongplsxuxfkvenew.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWRvbmdwbHN4dXhma3ZlbmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzI5OTAsImV4cCI6MjA3ODM0ODk5MH0.fviunVyk2nGqjA7A1d9HKgnEBsldSnlqSANPa1IVfNI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
