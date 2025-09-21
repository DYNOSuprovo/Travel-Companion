-- Add AI and personalization features tables
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  travel_style TEXT[] DEFAULT '{}', -- adventure, luxury, budget, cultural, relaxation
  interests TEXT[] DEFAULT '{}', -- food, history, nature, nightlife, shopping, etc.
  budget_preference TEXT CHECK (budget_preference IN ('budget', 'mid-range', 'luxury')),
  accommodation_preference TEXT[] DEFAULT '{}', -- hotel, hostel, airbnb, resort
  transport_preference TEXT[] DEFAULT '{}', -- flight, train, bus, car, bike
  dietary_restrictions TEXT[] DEFAULT '{}',
  language_preferences TEXT[] DEFAULT '{}',
  accessibility_needs TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('destination', 'activity', 'restaurant', 'accommodation', 'route')),
  title TEXT NOT NULL,
  description TEXT,
  location JSONB, -- {lat, lng, name, city, country}
  confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  reasoning TEXT, -- Why this was recommended
  metadata JSONB DEFAULT '{}', -- Additional data like price, rating, etc.
  is_dismissed BOOLEAN DEFAULT false,
  is_saved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS packing_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  travel_dates JSONB NOT NULL, -- {start_date, end_date}
  weather_forecast JSONB, -- Weather data for the trip
  activities JSONB DEFAULT '[]', -- Planned activities
  items JSONB NOT NULL DEFAULT '[]', -- Array of packing items with categories
  is_ai_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voice_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('query', 'command', 'feedback')),
  input_text TEXT NOT NULL,
  response_text TEXT,
  intent TEXT, -- Detected intent from the voice input
  entities JSONB DEFAULT '{}', -- Extracted entities (dates, locations, etc.)
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS translation_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_text, source_language, target_language)
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their recommendations" ON ai_recommendations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their packing lists" ON packing_lists
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their voice interactions" ON voice_interactions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Translation cache is readable by all authenticated users" ON translation_cache
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can add to translation cache" ON translation_cache
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
