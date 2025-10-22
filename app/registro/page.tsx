import { RegisterPage } from "../../src/pages/register"

export default RegisterPage

// Force SSR to avoid static generation issues with client-side routing
export const dynamic = 'force-dynamic'
