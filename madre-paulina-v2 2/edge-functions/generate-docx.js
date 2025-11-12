// Supabase Edge Function: Generate DOCX
// URL: https://weofljcxrbtjdirzzhpf.supabase.co/functions/v1/generate-docx

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
    const { title, content, metadata } = requestData;

    if (!title || !content) {
      return new Response(JSON.stringify({ error: 'Título y contenido requeridos' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Crear un DOCX simplificado usando XML
    const currentDate = new Date().toLocaleString('es-CL');
    const docxXML = `
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="32"/>
        </w:rPr>
        <w:t>${title}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:rPr>
          <w:i/>
          <w:sz w:val="22"/>
        </w:rPr>
        <w:t>Generado: ${currentDate}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>Desarrollado por René Álvarez Piñones</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:rPr>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>Creado con ❤️ para contribuir a la mejora continua</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:sz w:val="24"/>
      </w:rPr>
      <w:t>Copyright © 2025 - Plataforma Docente IA Madre Paulina</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:rPr>
          <w:sz w:val="28"/>
          <w:b/>
        </w:rPr>
        <w:t>Contenido:</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:sz w:val="24"/>
      </w:rPr>
        <w:t>${typeof content === 'string' ? content : JSON.stringify(content)}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>
    `;

    // Convertir a base64
    const encoder = new TextEncoder();
    const docxBytes = encoder.encode(docxXML);
    const base64 = btoa(String.fromCharCode(...docxBytes));

    return new Response(base64, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, '_')}.docx"`
      },
    });

  } catch (error) {
    console.error('Error generando DOCX:', error);
    return new Response(JSON.stringify({ 
      error: 'Error al generar DOCX',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
