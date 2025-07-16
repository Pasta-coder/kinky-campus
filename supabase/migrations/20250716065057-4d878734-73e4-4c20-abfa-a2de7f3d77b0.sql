
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table extending auth.users
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  fantasy_intensity_prefs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create fantasy questions table
CREATE TABLE public.fantasy_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  theme TEXT NOT NULL,
  intensity_level INT CHECK (intensity_level BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user fantasies table with encryption
CREATE TABLE public.user_fantasies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id INT REFERENCES public.fantasy_questions(id),
  answer TEXT, -- Will be encrypted
  intensity INT NOT NULL CHECK (intensity BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user1_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  unlocked_step INT DEFAULT 0,
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  cumulative_seconds INT DEFAULT 0
);

-- Create unlocked fantasies table
CREATE TABLE public.unlocked_fantasies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  fantasy_id UUID REFERENCES public.user_fantasies(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  unlock_step INT NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fantasy_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_fantasies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocked_fantasies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for fantasy_questions (public read)
CREATE POLICY "Anyone can view fantasy questions" ON public.fantasy_questions
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for user_fantasies (strict access control)
CREATE POLICY "Users can view their own fantasies" ON public.user_fantasies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fantasies" ON public.user_fantasies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fantasies" ON public.user_fantasies
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for matches
CREATE POLICY "Users can view their matches" ON public.matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "System can create matches" ON public.matches
  FOR INSERT WITH CHECK (true); -- Will be handled by edge functions

CREATE POLICY "Users can update their matches" ON public.matches
  FOR UPDATE USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their matches" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE id = match_id 
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their matches" ON public.chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE id = match_id 
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

-- RLS Policies for unlocked_fantasies
CREATE POLICY "Users can view unlocked fantasies in their matches" ON public.unlocked_fantasies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches 
      WHERE id = match_id 
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, gender)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'gender', 'male'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable realtime for chat_messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Seed some fantasy questions
INSERT INTO public.fantasy_questions (question, theme, intensity_level) VALUES
('Describe a fantasy involving an unexpected place on campus.', 'Adventure', 2),
('What''s one role-play scenario you''ve never admitted to?', 'Roleplay', 3),
('Tell us about a fantasy that involves the element of surprise.', 'Mystery', 2),
('What''s your ideal romantic scenario in a library setting?', 'Romance', 1),
('Describe a fantasy that takes place during a thunderstorm.', 'Nature', 3),
('What''s one adventurous scenario you''ve always wanted to try?', 'Adventure', 4),
('Tell us about a fantasy involving your favorite season.', 'Seasonal', 2),
('What''s one intimate scenario that makes your heart race?', 'Intimacy', 4),
('Describe a fantasy that involves dancing.', 'Performance', 2),
('What''s one scenario you''d want to experience under the stars?', 'Nature', 3);
