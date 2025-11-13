import htmlToDocx from '@turbodocx/html-to-docx'

export async function handler(event: any, context: any) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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

    // Agregar estilos para DOCX
    const styledHtml = `
      <div class="document">
        <style>
          .document { 
            font-family: 'Times New Roman', serif; 
            line-height: 1.6; 
            color: #333; 
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
        ${htmlContent}
      </div>
    `

    // Convertir HTML a DOCX
    const docxBuffer = await htmlToDocx(styledHtml, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
    })

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Disposition': 'attachment; filename="documento-madre-paulina.docx"'
      },
      body: docxBuffer.toString('base64'),
      isBase64Encoded: true
    }

  } catch (error: any) {
    console.error('Error generating DOCX:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }
  }
}