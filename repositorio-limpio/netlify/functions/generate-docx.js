// Netlify Function: Generate DOCX
// URL: /.netlify/functions/generate-docx

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
    const { title, content, metadata } = requestData;

    if (!title || !content) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Título y contenido requeridos' }),
      };
    }

    // Crear un DOCX simplificado usando XML
    const currentDate = new Date().toLocaleString('es-CL');
    const cleanContent = typeof content === 'string' 
      ? content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
      : JSON.stringify(content, null, 2);

    const docxXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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
        <w:rPr>
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
        <w:rPr>
          <w:sz w:val="24"/>
        </w:rPr>
        <w:t>${cleanContent}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;

    // Para Netlify Functions, devolver base64 con metadatos
    const docxBytes = Buffer.from(docxXML, 'utf-8');
    const base64 = docxBytes.toString('base64');
    const safeFilename = title.replace(/[^a-zA-Z0-9\s-]/g, '_').replace(/\s+/g, '_') + '.docx';

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
      },
      body: base64,
      isBase64Encoded: true,
    };

  } catch (error) {
    console.error('Error generando DOCX:', error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Error al generar DOCX',
        details: error.message 
      }),
    };
  }
};