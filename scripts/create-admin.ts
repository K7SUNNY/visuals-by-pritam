import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const envPath = path.resolve(process.cwd(), '.env')
const envContent = fs.readFileSync(envPath, 'utf-8')

function getEnv(key: string): string {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'))
  return match ? match[1].trim() : ''
}

const supabaseUrl = getEnv('VITE_SUPABASE_URL')
const serviceRoleKey = getEnv('VITE_SUPABASE_SERVICE_ROLE_KEY')

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY in your .env file.'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function createAdmin() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.log('Usage: npx tsx scripts/create-admin.ts <email> <password>')
    console.log('Example: npx tsx scripts/create-admin.ts admin@example.com SecurePass123!')
    process.exit(1)
  }

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: 'Admin',
      },
    })

    if (error) {
      console.error('Failed to create admin user:', error.message)
      process.exit(1)
    }

    console.log('Admin account created successfully!')
    console.log(`Email: ${data.user?.email}`)
    console.log(`User ID: ${data.user?.id}`)
    console.log('The admin profile was auto-created by the database trigger.')
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
}

createAdmin()