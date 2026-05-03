const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const MODELS = [
  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768',
  'llama-3.1-8b-instant'
];

/**
 * Service to handle AI generation using Groq API with fallback mechanism.
 */
export const AIService = {
  generatePost: async (product) => {
    const prompt = `
      Eres un experto en marketing para boutiques de ropa de segunda mano de alta calidad. 
      Tu objetivo es crear una publicación de Facebook DIRECTA y RESUMIDA.
      
      Información del producto:
      - Nombre: ${product.name}
      - Descripción original: ${product.description || 'Sin descripción'}
      - Precio: C$ ${product.price}
      - Marca: ${product.brand || 'No especificada'}
      - Talla: ${product.size || 'No especificada'}
      - Condición: ${product.condition || 'Excelente'}
      - Materiales: ${product.materials ? (Array.isArray(product.materials) ? product.materials.join(', ') : product.materials) : 'No especificados'}
      
      Instrucciones de formato (SÍGUELAS ESTRICTAMENTE):
      1. GANCHO: Una frase corta y llamativa de máximo 10-12 palabras con emojis.
      2. CARACTERÍSTICAS: Una lista de puntos clave (Talla, Marca, Estado, Precio) de forma muy limpia.
      3. No uses párrafos largos. La gente quiere leer lo importante rápido.
      
      Formato de respuesta (ESTRICTO):
      TITULO: [Aquí el título corto con emojis]
      DESCRIPCION: [Gancho de ~10 palabras]

      ✨ DETALLES:
      • Talla: [Talla]
      • Marca: [Marca]
      • Estado: [Condición]
      • Inversión: C$ [Precio]
    `;

    for (const model of MODELS) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7
          })
        });

        if (response.status === 429) {
          console.warn(`Model ${model} rate limited, trying next fallback...`);
          continue;
        }

        if (!response.ok) {
          throw new Error(`Groq API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Parse title and description
        const titleMatch = content.match(/TITULO:\s*(.*)/i);
        const descMatch = content.match(/DESCRIPCION:\s*([\s\S]*)/i);

        return {
          title: titleMatch ? titleMatch[1].trim() : '¡Nueva Prenda Disponible!',
          description: descMatch ? descMatch[1].trim() : content
        };
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        if (model === MODELS[MODELS.length - 1]) {
          throw error;
        }
      }
    }
  },

  polishText: async (name, description) => {
    const prompt = `
Eres un corrector de texto profesional para una tienda de ropa. Tu ÚNICA tarea es:
1. Corregir faltas de ortografía
2. Arreglar puntuación (comas, puntos, tildes)
3. Mejorar la redacción para que suene profesional y limpia
4. NO inventes información nueva. NO agregues detalles que no estén en el texto original.
5. Si el texto ya está bien, devuélvelo igual.
6. Mantén el texto CORTO y DIRECTO.

Texto del nombre del producto:
"${name}"

Texto de la descripción del producto:
"${description || ''}"

Responde EXACTAMENTE en este formato (sin explicaciones adicionales):
NOMBRE: [nombre corregido]
DESCRIPCION: [descripción corregida]
    `;

    for (const model of MODELS) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2
          })
        });

        if (response.status === 429) {
          console.warn(`Model ${model} rate limited, trying next fallback...`);
          continue;
        }

        if (!response.ok) {
          throw new Error(`Groq API error: ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        const nameMatch = content.match(/NOMBRE:\s*(.*)/i);
        const descMatch = content.match(/DESCRIPCION:\s*([\s\S]*)/i);

        return {
          name: nameMatch ? nameMatch[1].trim() : name,
          description: descMatch ? descMatch[1].trim() : description
        };
      } catch (error) {
        console.error(`Error with model ${model}:`, error);
        if (model === MODELS[MODELS.length - 1]) {
          throw error;
        }
      }
    }
  }
};
