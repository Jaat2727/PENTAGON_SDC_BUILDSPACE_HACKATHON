-- ============================================
-- BuildSpace: Profile & Projects Enhancement
-- ============================================

-- 1. Ensure profiles table has all necessary fields
DO $$ 
BEGIN 
    -- Add location if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'location') THEN
        ALTER TABLE public.profiles ADD COLUMN location TEXT;
    END IF;

    -- Add social URLs
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'github_url') THEN
        ALTER TABLE public.profiles ADD COLUMN github_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'linkedin_url') THEN
        ALTER TABLE public.profiles ADD COLUMN linkedin_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'twitter_url') THEN
        ALTER TABLE public.profiles ADD COLUMN twitter_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'website_url') THEN
        ALTER TABLE public.profiles ADD COLUMN website_url TEXT;
    END IF;

    -- Add skills array
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'skills') THEN
        ALTER TABLE public.profiles ADD COLUMN skills TEXT[] DEFAULT '{}';
    END IF;

    -- Add stats fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'commits_count') THEN
        ALTER TABLE public.profiles ADD COLUMN commits_count INT DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'followers_count') THEN
        ALTER TABLE public.profiles ADD COLUMN followers_count INT DEFAULT 0;
    END IF;
END $$;

-- 2. Enhance projects table for the showcase
DO $$ 
BEGIN 
    -- Add stars_count
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'stars_count') THEN
        ALTER TABLE public.projects ADD COLUMN stars_count INT DEFAULT 0;
    END IF;

    -- Add language
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'language') THEN
        ALTER TABLE public.projects ADD COLUMN language TEXT;
    END IF;

    -- Add code_snippet preview
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'code_snippet') THEN
        ALTER TABLE public.projects ADD COLUMN code_snippet TEXT;
    END IF;
END $$;
