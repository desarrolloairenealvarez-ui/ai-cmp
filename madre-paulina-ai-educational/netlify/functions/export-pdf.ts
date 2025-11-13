import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'

export async function handler(event: any, context: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/pdf',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { htmlContent } = JSON.parse(event.body)
    
    if (!htmlContent) {
      throw new Error('htmlContent requerido')
    }

    let browser = null
    
    try {
      // Usar chrome-aws-lambda para entorno serverless
      const executablePath = await chromium.executablePath
      
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath,
        headless: chromium.headless,
      })

      const page = await browser.newPage()

      // Leer insignia y convertir a Base64
      let logoBase64 = ''
      try {
        // En implementación real, leer de filesystem:
        // const logoBuffer = await fs.readFileSync('./insignia.png')
        // logoBase64 = logoBuffer.toString('base64')
        
        // Por ahora, usar placeholder
        logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
      } catch (logoError) {
        console.log('Logo no encontrado, continuando sin membrete')
      }

      const headerHtml = logoBase64 ? `
        <div style="width: 100%; font-size: 10px; padding: 10px 40px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #ddd; box-sizing: border-box;">
          <img src="${logoBase64}" style="height: 40px; width: auto;">
          <span style="color: #555;">Generado con IA Colegio Madre Paulina</span>
        </div>
      ` : ''

      // Configurar el contenido HTML con estilos
      const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Documento Colegio Madre Paulina</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 { 
              color: #1e40af; 
              border-bottom: 2px solid #3b82f6; 
              padding-bottom: 10px;
              margin-top: 20px;
            }
            h2 { 
              color: #374151; 
              margin-top: 30px; 
              margin-bottom: 15px;
            }
            .planning-document, .analysis-document, .rubric-document, .questions-document, .dok3-document, .evaluation-document, .balance-document {
              margin-bottom: 30px;
            }
          </style>
        </head>
        <body>
          ${headerHtml}
          <div style="margin-top: 20px;">
            ${htmlContent}
          </div>
        </body>
        </html>
      `

      await page.setContent(fullHtml, { waitUntil: 'networkidle0' })

      // Generar PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: headerHtml,
        margin: {
          top: logoBase64 ? '80px' : '40px', // Espacio para el membrete
          bottom: '40px',
          left: '40px',
          right: '40px'
        }
      })

      await browser.close()

      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Disposition': 'attachment; filename="documento-madre-paulina.pdf"'
        },
        body: pdfBuffer.toString('base64'),
        isBase64Encoded: true
      }

    } finally {
      if (browser) {
        await browser.close()
      }
    }

  } catch (error: any) {
    console.error('Error generating PDF:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}