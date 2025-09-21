-- Add emergency and offline features tables
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  relationship TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offline_maps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  region_name TEXT NOT NULL,
  bounds JSONB NOT NULL, -- {north, south, east, west}
  download_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_size BIGINT,
  status TEXT DEFAULT 'downloading' CHECK (status IN ('downloading', 'ready', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emergency_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location JSONB NOT NULL, -- {lat, lng, accuracy}
  alert_type TEXT NOT NULL CHECK (alert_type IN ('sos', 'medical', 'breakdown', 'lost')),
  message TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'cancelled')),
  contacts_notified JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their emergency contacts" ON emergency_contacts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their offline maps" ON offline_maps
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their emergency alerts" ON emergency_alerts
  FOR ALL USING (auth.uid() = user_id);
