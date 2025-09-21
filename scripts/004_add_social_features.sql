-- Add social and community features tables
CREATE TABLE IF NOT EXISTS travel_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  photos JSONB DEFAULT '[]', -- Array of photo URLs
  location JSONB, -- {lat, lng, name}
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS story_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id UUID REFERENCES travel_stories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, story_id)
);

CREATE TABLE IF NOT EXISTS story_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id UUID REFERENCES travel_stories(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS travel_buddies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  buddy_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, buddy_user_id)
);

CREATE TABLE IF NOT EXISTS buddy_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  travel_dates JSONB NOT NULL, -- {start_date, end_date}
  interests TEXT[] DEFAULT '{}',
  budget_range JSONB, -- {min, max, currency}
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE IF NOT EXISTS local_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location JSONB NOT NULL, -- {lat, lng, name, city, country}
  category TEXT NOT NULL CHECK (category IN ('restaurant', 'attraction', 'activity', 'accommodation', 'transport', 'shopping')),
  name TEXT NOT NULL,
  description TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
  photos JSONB DEFAULT '[]',
  tips TEXT,
  is_verified BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  payer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  participants JSONB NOT NULL, -- Array of user IDs who should split the expense
  splits JSONB NOT NULL, -- {user_id: amount} mapping
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'settled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settled_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE travel_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_buddies ENABLE ROW LEVEL SECURITY;
ALTER TABLE buddy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE local_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public stories are viewable by everyone" ON travel_stories
  FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own stories" ON travel_stories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can like any public story" ON story_likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can comment on public stories" ON story_comments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view story comments on public stories" ON story_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM travel_stories 
      WHERE travel_stories.id = story_comments.story_id 
      AND (travel_stories.is_public = true OR travel_stories.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their travel buddy connections" ON travel_buddies
  FOR ALL USING (auth.uid() = user_id OR auth.uid() = buddy_user_id);

CREATE POLICY "Users can view and create buddy requests" ON buddy_requests
  FOR ALL USING (auth.uid() = requester_id);

CREATE POLICY "Active buddy requests are viewable by everyone" ON buddy_requests
  FOR SELECT USING (is_active = true AND expires_at > NOW());

CREATE POLICY "Users can manage their recommendations" ON local_recommendations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public recommendations are viewable by everyone" ON local_recommendations
  FOR SELECT USING (true);

CREATE POLICY "Trip participants can manage group expenses" ON group_expenses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM trips 
      WHERE trips.id = group_expenses.trip_id 
      AND (trips.user_id = auth.uid() OR auth.uid() = ANY(trips.companions))
    )
  );
