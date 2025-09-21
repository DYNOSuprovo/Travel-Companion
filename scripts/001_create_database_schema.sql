-- Travel Companion App Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profiles table (references auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  nationality TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trips table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_number TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  transport_mode TEXT NOT NULL CHECK (transport_mode IN ('walking', 'cycling', 'car', 'bus', 'train', 'flight', 'other')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  distance_km DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip companions table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.trip_companions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  companion_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  added_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trip_id, companion_user_id)
);

-- User rewards and badges
CREATE TABLE IF NOT EXISTS public.user_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  description TEXT,
  points INTEGER DEFAULT 0,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trip feedback and ratings
CREATE TABLE IF NOT EXISTS public.trip_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  suggestions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences for ML recommendations
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_transport_modes TEXT[] DEFAULT '{}',
  budget_range_min DECIMAL(10,2),
  budget_range_max DECIMAL(10,2),
  preferred_trip_duration_hours INTEGER,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_companions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for trips
CREATE POLICY "trips_select_own" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trips_insert_own" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trips_update_own" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "trips_delete_own" ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for trip_companions (users can see companions for their trips)
CREATE POLICY "trip_companions_select" ON public.trip_companions FOR SELECT 
USING (
  auth.uid() = companion_user_id OR 
  auth.uid() = added_by OR 
  EXISTS (SELECT 1 FROM public.trips WHERE trips.id = trip_id AND trips.user_id = auth.uid())
);
CREATE POLICY "trip_companions_insert" ON public.trip_companions FOR INSERT WITH CHECK (auth.uid() = added_by);
CREATE POLICY "trip_companions_update" ON public.trip_companions FOR UPDATE 
USING (auth.uid() = companion_user_id OR auth.uid() = added_by);
CREATE POLICY "trip_companions_delete" ON public.trip_companions FOR DELETE 
USING (auth.uid() = companion_user_id OR auth.uid() = added_by);

-- RLS Policies for user_rewards
CREATE POLICY "user_rewards_select_own" ON public.user_rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_rewards_insert_own" ON public.user_rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for trip_feedback
CREATE POLICY "trip_feedback_select_own" ON public.trip_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "trip_feedback_insert_own" ON public.trip_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "trip_feedback_update_own" ON public.trip_feedback FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "user_preferences_select_own" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_preferences_insert_own" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_preferences_update_own" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "user_preferences_delete_own" ON public.user_preferences FOR DELETE USING (auth.uid() = user_id);

-- Create trigger function for auto-creating user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, state, city, nationality)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'state', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'city', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'nationality', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto-creating profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_trip_companions_trip_id ON public.trip_companions(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_companions_companion_user_id ON public.trip_companions(companion_user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_user_id ON public.user_rewards(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_feedback_trip_id ON public.trip_feedback(trip_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
