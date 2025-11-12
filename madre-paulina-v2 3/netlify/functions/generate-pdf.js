// Netlify Function: Generate PDF
// URL: /.netlify/functions/generate-pdf

exports.handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: null,
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Método no permitido' }),
      };
    }

    const requestData = JSON.parse(event.body || '{}');
    const { html, filename = 'documento.pdf' } = requestData;

    if (!html) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'HTML requerido' }),
      };
    }

    // Implementación simplificada de PDF
    // En producción, usar Puppeteer o servicio externo
    const cleanContent = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    
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
/Length ${Math.max(200, cleanContent.length + 200)}
>>
stream
BT
/F1 12 Tf
50 750 Td
(Plataforma Docente IA - Madre Paulina) Tj
0 -20 Td
(Documento educativo generado) Tj
0 -40 Td
(${cleanContent.substring(0, 200)}) Tj
0 -40 Td
(Función de exportación PDF) Tj
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
${Math.max(350, cleanContent.length + 350)}
%%EOF
    `;

    // Para Netlify Functions, devolver base64 con metadatos
    const encoder = new TextEncoder();
    const pdfBytes = encoder.encode(pdfContent);
    const base64 = Buffer.from(pdfBytes).toString('base64');

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
      body: base64,
      isBase64Encoded: true,
    };

  } catch (error) {
    console.error('Error generando PDF:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Error al generar PDF',
        details: error.message 
      }),
    };
  }
};