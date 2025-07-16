
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { matchId, cumulativeSeconds } = await req.json()

    console.log('Processing unlock request for match:', matchId, 'with seconds:', cumulativeSeconds)

    // Get current match data
    const { data: match, error: matchError } = await supabaseClient
      .from('matches')
      .select('unlocked_step, user1_id, user2_id')
      .eq('id', matchId)
      .single()

    if (matchError) {
      throw new Error(`Failed to fetch match: ${matchError.message}`)
    }

    if (!match) {
      throw new Error('Match not found')
    }

    const currentStep = match.unlocked_step || 0
    const timeThreshold = 1200 * (currentStep + 1) // 20 minutes per step (1200 seconds)

    console.log('Current step:', currentStep, 'Time threshold:', timeThreshold, 'Cumulative seconds:', cumulativeSeconds)

    // Check if it's time to unlock next fantasy
    if (cumulativeSeconds >= timeThreshold && currentStep < 3) {
      const nextStep = currentStep + 1

      // Get random fantasy from each user to unlock
      const { data: user1Fantasy } = await supabaseClient
        .from('user_fantasies')
        .select('id')
        .eq('user_id', match.user1_id)
        .limit(1)
        .single()

      const { data: user2Fantasy } = await supabaseClient
        .from('user_fantasies')
        .select('id')
        .eq('user_id', match.user2_id)
        .limit(1)
        .single()

      // Create unlocked fantasy records
      if (user1Fantasy) {
        await supabaseClient
          .from('unlocked_fantasies')
          .insert({
            match_id: matchId,
            fantasy_id: user1Fantasy.id,
            unlock_step: nextStep
          })
      }

      if (user2Fantasy) {
        await supabaseClient
          .from('unlocked_fantasies')
          .insert({
            match_id: matchId,
            fantasy_id: user2Fantasy.id,
            unlock_step: nextStep
          })
      }

      // Update match unlock step
      const { error: updateError } = await supabaseClient
        .from('matches')
        .update({ unlocked_step: nextStep })
        .eq('id', matchId)

      if (updateError) {
        throw new Error(`Failed to update match step: ${updateError.message}`)
      }

      console.log('Successfully unlocked step:', nextStep)

      return new Response(
        JSON.stringify({ 
          success: true, 
          unlockedStep: nextStep,
          message: `Fantasy step ${nextStep} unlocked!`
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Not enough time elapsed for unlock',
        currentStep,
        timeThreshold,
        cumulativeSeconds 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in unlock-fantasy function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
