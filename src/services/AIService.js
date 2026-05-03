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
      Tu objetivo es crear una publicación atractiva, elegante y persuasiva para Facebook.
      
      Información del producto:
      - Nombre: ${product.name}
      - Descripción original: ${product.description || 'Sin descripción'}
      - Precio: C$ ${product.price}
      - Marca: ${product.brand || 'No especificada'}
      - Talla: ${product.size || 'No especificada'}
      - Condición: ${product.condition || 'Excelente'}
      - Materiales: ${product.materials ? product.materials.join(', ') : 'No especificados'}
      
      Instrucciones:
      1. Genera un TÍTULO llamativo que incluya emojis.
      2. Genera una DESCRIPCIÓN elegante que resalte los beneficios de la prenda, incluya los detalles técnicos (talla, precio, marca, estado) y un llamado a la acción invitando a comprar en el catálogo web.
      3. Mantén un tono real, sofisticado y cercano.
      
      Formato de respuesta (ESTRICTO):
      TITULO: [Aquí el título]
      DESCRIPCION: [Aquí la descripción]
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
  }
};
