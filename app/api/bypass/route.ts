import { NextResponse } from 'next/server';

// Route de bypass pour accéder aux projets sans authentification
export async function GET() {
  console.log("🚀 Bypass route accessed - redirecting to projects");
  
  // Test si on peut accéder à l'API des projets
  try {
    const projectsUrl = new URL('/api/v0/projects', 'http://localhost:3000');
    console.log("📋 Testing projects API at:", projectsUrl.toString());
  } catch (error) {
    console.error("❌ Error testing projects API:", error);
  }
  
  // Redirection vers la liste des projets sans vérification d'auth
  const redirectUrl = new URL('/fr/apps/projects/gestion/liste', 'http://localhost:3000');
  console.log("🔄 Redirecting to:", redirectUrl.toString());
  return NextResponse.redirect(redirectUrl);
}
