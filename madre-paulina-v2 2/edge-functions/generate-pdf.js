// Supabase Edge Function: Generate PDF
// URL: https://weofljcxrbtjdirzzhpf.supabase.co/functions/v1/generate-pdf

Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método no permitido' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const requestData = await req.json();
    const { html, filename = 'documento.pdf' } = requestData;

    if (!html) {
      return new Response(JSON.stringify({ error: 'HTML requerido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Por limitaciones de Deno, crearemos un PDF simple
    // En una implementación real, usarías un servicio como Puppeteer API o similar
    const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length ${html.length + 200}
>>
stream
BT
/F1 12 Tf
50 750 Td
(Generado por Plataforma Madre Paulina) Tj
0 -20 Td
(Contenido del documento educativo) Tj
0 -40 Td
(Función PDF en desarrollo) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000227 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
${350 + html.length}
%%EOF
    `;

    // Convertir a base64
    const encoder = new TextEncoder();
    const pdfBytes = encoder.encode(pdfContent);
    const base64 = btoa(String.fromCharCode(...pdfBytes));

    return new Response(base64, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      },
    });

  } catch (error) {
    console.error('Error generando PDF:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al generar PDF',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
