import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userData } =
      await request.json()

    console.log('Received userData:', userData) // Debug log

    // -----------------------------
    // 1️⃣ Verify Razorpay payment
    // -----------------------------
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest('hex')

    if (razorpay_signature !== expectedSign) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    // -----------------------------
    // 2️⃣ Validate and sanitize user data
    // -----------------------------
    // Check what values are actually being sent
    console.log('Raw plan value:', userData.plan, 'Type:', typeof userData.plan)
    
    // Define valid values - these MUST match your database constraint exactly
    const validPlans = ['basic', 'premium', 'pro'] // or whatever your constraint allows
    const validPaymentStatuses = ['pending', 'success', 'failed']

    // Validate plan - be more explicit about the validation
    let plan: string
    if (userData.plan && typeof userData.plan === 'string' && validPlans.includes(userData.plan.toLowerCase())) {
      plan = userData.plan.toLowerCase()
    } else {
      console.log(`Invalid plan received: ${userData.plan}, defaulting to 'basic'`)
      plan = 'basic'
    }

    // Since payment was successful, set status to success
    const payment_status = 'success'

    // Generate subdomain from restaurant name
    const generateSubdomain = (restaurantName: string): string => {
      if (!restaurantName) return ''
      
      // Clean the restaurant name: remove special characters, convert to lowercase, replace spaces with hyphens
      const cleanName = restaurantName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      
      return `${cleanName}.eatnify.com`
    }

    const subdomain = generateSubdomain(userData.restaurant_name || '')

    console.log('Generated subdomain:', subdomain) // Debug log
    console.log('Final plan value:', plan) // Debug log
    console.log('Final payment_status:', payment_status) // Debug log

    // Create user data object for insertion
    const userDataToInsert = {
      name: userData.name || null,
      email: userData.email,
      password: userData.password, // Fixed: was 'pass' instead of 'password'
      phone_number: userData.phone_number || null,
      restaurant_name: userData.restaurant_name || null,
      plan: plan, // Use the validated plan
      subdomain: subdomain, // Use generated subdomain
      custom_domain: null,
      payment_status: payment_status
    }

    console.log('Data to insert:', userDataToInsert) // Debug log

    // -----------------------------
    // 3️⃣ Insert user into database
    // -----------------------------
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert(userDataToInsert)
      .select()
      .single()

    if (userError) {
      console.error('Error inserting user:', userError)
      console.error('Error details:', {
        message: userError.message,
        details: userError.details,
        hint: userError.hint,
        code: userError.code
      })
      
      // Return more specific error information
      return NextResponse.json(
        { 
          error: 'Failed to create user account',
          details: userError.message,
          hint: userError.hint 
        },
        { status: 500 }
      )
    }

    // -----------------------------
    // 4️⃣ Create Supabase auth user (server-side only)
    // -----------------------------
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password, // Use the actual password instead of random
      email_confirmed: true,
      user_metadata: {
        name: userData.name,
        restaurant_name: userData.restaurant_name,
        user_id: user.id,
        subdomain: subdomain
      }
    })

    if (authError) {
      console.error('Auth user creation error:', authError)
      // Payment succeeded, so don't fail the request if auth creation fails
      // But you might want to log this for manual cleanup later
    }

    // -----------------------------
    // 5️⃣ Return success response
    // -----------------------------
    return NextResponse.json({
      success: true,
      message: 'Payment verified and account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        restaurant_name: user.restaurant_name,
        subdomain: user.subdomain,
        plan: user.plan,
        password: user.password 
      }
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
  }
}