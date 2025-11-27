import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

// Storage bucket names
export const STORAGE_BUCKETS = {
    KYC_DOCUMENTS: 'kyc-documents',
    PROOF_OF_DELIVERY: 'proof-of-delivery',
    PROFILE_PHOTOS: 'profile-photos',
};
