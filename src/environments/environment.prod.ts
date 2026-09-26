export const environment = {
  production: true,
  // Vercel reenvía esta ruta a la API HTTP de AWS. El navegador nunca carga
  // contenido mixto porque realiza la llamada sobre el mismo dominio HTTPS.
  apiUrl: '/api/v1/empleados',
};
