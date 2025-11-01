import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'https://esm.sh/resend'; // <-- This is the main fix
import { corsHeaders } from '../_shared/cors.js';

// Initialize Resend with your API key from environment variables
const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL'),
      Deno.env.get('SUPABASE_ANON_KEY'),
      { global: { headers: { Authorization: req.headers.get('Authorization') } } }
    );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const { error: dbError } = await supabase
      .from('otp_codes')
      .upsert({ email, otp, expires_at }, { onConflict: 'email' });

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }

    const { data, error: emailError } = await resend.emails.send({
      from: 'onboarding@resend.dev', // IMPORTANT: Use a verified domain
      to: email,
      subject: 'Your Password Reset Code',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
          <h2>Password Reset Request</h2>
          <p>Your OTP code is:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background: #f0f0f0; padding: 10px 20px; border-radius: 5px; display: inline-block;">${otp}</p>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    });

    if (emailError) {
      throw new Error(`Resend API error: ${emailError.message}`);
    }

    return new Response(JSON.stringify({ success: true, message: 'OTP sent successfully!' }), {
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