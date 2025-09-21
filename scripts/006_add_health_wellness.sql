-- Add health and wellness features tables
CREATE TABLE IF NOT EXISTS health_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  medical_conditions TEXT[] DEFAULT '{}',
  medications TEXT[] DEFAULT '{}',
  allergies TEXT[] DEFAULT '{}',
  dietary_restrictions TEXT[] DEFAULT '{}',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  blood_type TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS fitness_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('walking', 'running', 'cycling', 'hiking', 'swimming', 'yoga', 'gym', 'other')),
  duration_minutes INTEGER NOT NULL,
  distance_km DECIMAL(8,2),
  calories_burned INTEGER,
  location JSONB, -- {lat, lng, name}
  notes TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('medication', 'hydration', 'exercise', 'sleep', 'vaccination', 'custom')),
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL CHECK (frequency IN ('once', 'daily', 'weekly', 'custom')),
  time_of_day TIME,
  custom_schedule JSONB, -- For complex schedules
  is_active BOOLEAN DEFAULT true,
  last_completed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jet_lag_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  origin_timezone TEXT NOT NULL,
  destination_timezone TEXT NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE NOT NULL,
  time_difference_hours INTEGER NOT NULL,
  adjustment_plan JSONB NOT NULL, -- Daily schedule adjustments
  sleep_schedule JSONB NOT NULL, -- Recommended sleep times
  light_exposure_plan JSONB NOT NULL, -- Light therapy recommendations
  meal_timing JSONB NOT NULL, -- Meal schedule adjustments
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wellness_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('sleep_hours', 'water_intake', 'stress_level', 'energy_level', 'mood', 'weight')),
  value DECIMAL(8,2) NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS travel_vaccinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vaccination_name TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  is_required BOOLEAN DEFAULT false,
  is_recommended BOOLEAN DEFAULT true,
  date_administered DATE,
  expiry_date DATE,
  clinic_name TEXT,
  batch_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE health_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE jet_lag_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_vaccinations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their health profile" ON health_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their fitness activities" ON fitness_activities
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their health reminders" ON health_reminders
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their jet lag plans" ON jet_lag_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their wellness metrics" ON wellness_metrics
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their vaccination records" ON travel_vaccinations
  FOR ALL USING (auth.uid() = user_id);
