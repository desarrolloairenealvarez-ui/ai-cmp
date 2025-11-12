// Netlify Function: Exportar a PDF
// URL: /.netlify/functions/9-export-pdf

const puppeteer = require('puppeteer');

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
    const { htmlContent, filename = 'documento.pdf', title = 'Documento Educativo' } = requestData;

    if (!htmlContent) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Contenido HTML requerido' }),
      };
    }

    // HTML/CSS para headerTemplate con insignia base64
    const base64Logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="; // Placeholder - se debe reemplazar con la insignia real

    const headerTemplate = `
      <div style="width: 100%; font-family: Arial, sans-serif; font-size: 10px; padding: 0 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eeeeee; box-sizing: border-box; height: 80px;">
        <img 
          src="${base64Logo}" 
          style="height: 50px; width: auto;" 
          alt="Insignia Colegio Madre Paulina"
        />
        <span style="color: #555555;">
          Generado con IA Colegio Madre Paulina
        </span>
      </div>
    `;

    // Configurar navegador Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Configurar el contenido
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Generar PDF con configuración específica
    const pdf = await page.pdf({
      displayHeaderFooter: true,
      headerTemplate: headerTemplate,
      printBackground: true,
      margin: {
        top: '100px',
        bottom: '50px',
        left: '40px',
        right: '40px'
      },
      format: 'A4',
      preferCSSPageSize: true
    });

    await browser.close();

    // Devolver PDF como respuesta
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}"`,
        'Content-Length': pdf.length.toString()
      },
      body: pdf.toString('base64'),
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