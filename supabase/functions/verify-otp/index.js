import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'; // <-- This is the main fix
import { corsHeaders } from '../_shared/cors.js';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return new Response(JSON.stringify({ error: 'Email and OTP are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_ANON_KEY'),
      { global: { headers: { Authorization: req.headers.get('Authorization') } } }
    );

    const { data, error } = await supabase
      .from('otp_codes')
      .select('otp, expires_at')
      .eq('email', email)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid OTP or email.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (new Date() > new Date(data.expires_at)) {
      await supabase.from('otp_codes').delete().eq('email', email);
      return new Response(JSON.stringify({ success: false, error: 'OTP has expired.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    if (data.otp !== otp) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid OTP.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    await supabase.from('otp_codes').delete().eq('email', email);

    return new Response(JSON.stringify({ success: true, message: 'OTP verified successfully!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});