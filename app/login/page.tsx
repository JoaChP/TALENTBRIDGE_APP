import { LoginPage } from "../../src/pages/login"

export default LoginPage

// Force SSR to avoid static generation issues with client-side routing
export const dynamic = 'force-dynamic'
