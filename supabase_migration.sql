-- Create the system_settings table to store the ideal profile
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS (Optional, but good practice)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to anyone (or authenticated users)
CREATE POLICY "Allow public read access" ON public.system_settings FOR SELECT USING (true);

-- Allow write access only to admins (if you have an admin role, otherwise adjust this)
-- For now, allowing all authenticated users just to ensure it works
CREATE POLICY "Allow all updates" ON public.system_settings FOR ALL USING (true);

-- Insert the default ideal profile
INSERT INTO public.system_settings (setting_key, setting_value)
VALUES (
    'ideal_profile',
    '{
        "energy": { "razao": 39, "acao": 34, "emocao": 37, "total": 110 },
        "vision": { "alien": 16, "robo": 48, "mamifero": 12, "tubarao": 24 },
        "personality": { "aberto": 4, "fechado": 6, "tradicional": 13, "inovador": 7, "pensador": 9, "sentimento": 11, "decisivo": 12, "flexivel": 8 },
        "player": { "pragmatico": 50, "expressivo": 50, "afavel": 50, "analitico": 50 },
        "power": { "tipo1": 100, "tipo2": 100, "tipo3": 100, "tipo4": 100, "tipo5": 100, "tipo6": 100, "tipo7": 100, "tipo8": 100, "tipo9": 100 }
    }'::jsonb
)
ON CONFLICT (setting_key) DO UPDATE 
SET setting_value = EXCLUDED.setting_value;
