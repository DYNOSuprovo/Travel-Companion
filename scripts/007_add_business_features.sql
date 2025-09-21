-- Add business and professional travel features tables
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  employee_id TEXT,
  department TEXT,
  manager_email TEXT,
  travel_policy_url TEXT,
  preferred_airlines TEXT[] DEFAULT '{}',
  preferred_hotels TEXT[] DEFAULT '{}',
  seat_preference TEXT,
  meal_preference TEXT,
  loyalty_programs JSONB DEFAULT '{}', -- {airline: number, hotel: number}
  expense_approval_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS business_trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL CHECK (purpose IN ('meeting', 'conference', 'training', 'client_visit', 'other')),
  client_company TEXT,
  project_code TEXT,
  cost_center TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  budget_allocated DECIMAL(10,2),
  budget_currency TEXT DEFAULT 'USD',
  is_billable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expense_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_trip_id UUID REFERENCES business_trips(id) ON DELETE CASCADE,
  report_name TEXT NOT NULL,
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'paid')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expense_line_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_report_id UUID REFERENCES expense_reports(id) ON DELETE CASCADE,
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  exchange_rate DECIMAL(10,6) DEFAULT 1.0,
  amount_usd DECIMAL(10,2) NOT NULL,
  is_reimbursable BOOLEAN DEFAULT true,
  requires_receipt BOOLEAN DEFAULT true,
  receipt_submitted BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mileage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_trip_id UUID REFERENCES business_trips(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  distance_miles DECIMAL(8,2) NOT NULL,
  distance_km DECIMAL(8,2) NOT NULL,
  purpose TEXT NOT NULL,
  vehicle_type TEXT DEFAULT 'personal',
  rate_per_mile DECIMAL(4,2) DEFAULT 0.65, -- IRS standard rate
  total_reimbursement DECIMAL(8,2) NOT NULL,
  odometer_start INTEGER,
  odometer_end INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS travel_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_trip_id UUID REFERENCES business_trips(id) ON DELETE CASCADE,
  approver_email TEXT NOT NULL,
  approval_type TEXT NOT NULL CHECK (approval_type IN ('travel', 'expense', 'budget')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS corporate_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  vendor_type TEXT NOT NULL CHECK (vendor_type IN ('airline', 'hotel', 'car_rental')),
  vendor_name TEXT NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('discount_percentage', 'fixed_rate', 'negotiated')),
  rate_value DECIMAL(8,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  booking_code TEXT,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE mileage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their business profile" ON business_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their business trips" ON business_trips
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their expense reports" ON expense_reports
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view expense line items for their reports" ON expense_line_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM expense_reports 
      WHERE expense_reports.id = expense_line_items.expense_report_id 
      AND expense_reports.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their mileage tracking" ON mileage_tracking
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view travel approvals for their trips" ON travel_approvals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM business_trips 
      WHERE business_trips.id = travel_approvals.business_trip_id 
      AND business_trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Corporate rates are viewable by all authenticated users" ON corporate_rates
  FOR SELECT USING (auth.uid() IS NOT NULL);
