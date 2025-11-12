// Netlify Function: Exportar a DOCX
// URL: /.netlify/functions/9-export-docx

const { convert } = require('@turbodocx/html-to-docx');

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
    const { htmlContent, filename = 'documento.docx', title = 'Documento Educativo' } = requestData;

    if (!htmlContent) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Contenido HTML requerido' }),
      };
    }

    // Enriquecer el HTML con información del colegio
    const enhancedHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>${title} - Colegio Madre Paulina</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #6B73FF; padding-bottom: 20px; }
          .logo { max-width: 100px; height: auto; margin-bottom: 10px; }
          .school-name { color: #6B73FF; font-size: 24px; font-weight: bold; margin-bottom: 5px; }
          .document-title { color: #333; font-size: 18px; margin-top: 10px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center; }
          .content { margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="school-name">Colegio Madre Paulina</h1>
          <div class="document-title">${title}</div>
        </div>
        <div class="content">
          ${htmlContent}
        </div>
        <div class="footer">
          <p>Generado con IA - Plataforma Docente Colegio Madre Paulina</p>
          <p>Fecha: ${new Date().toLocaleDateString('es-CL')}</p>
        </div>
      </body>
      </html>
    `;

    // Convertir HTML a DOCX
    const docxBuffer = await convert(enhancedHtml, {
      document: {
        creator: 'IA Colegio Madre Paulina',
        producer: 'Sistema de Asistente Pedagógico',
        title: title,
        subject: 'Documento Educativo'
      },
      footer: true,
      pageNumber: true
    });

    // Devolver DOCX como respuesta
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}"`,
        'Content-Length': docxBuffer.length.toString()
      },
      body: docxBuffer.toString('base64'),
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