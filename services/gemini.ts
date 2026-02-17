
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `Eres un sistema experto en Reconocimiento Óptico de Música (OMR) de grado profesional, equivalente a PhotoScore o Finale.
Tu objetivo es transcribir imágenes de partituras a MusicXML 4.0 con una fidelidad absoluta.

REGLAS DE TRANSCRIPCIÓN PROFESIONAL:
1. NOTACIÓN COMPLETA: Captura notas, silencios, claves, armaduras, compases, alteraciones y barras de compás.
2. EXPRESIÓN Y DINÁMICA: Incluye TODAS las marcas de expresión (p, f, mf, cresc., dim.), ligaduras de prolongación y de expresión.
3. ARTICULACIÓN: Detecta staccatos, acentos, tenutos y fermatas.
4. ESTRUCTURA POLIFÓNICA: Si hay varias voces en un solo pentagrama, codifícalas como <voice> independientes.
5. SISTEMAS MÚLTIPLES: Para piano u orquesta, mantén la relación entre pentagramas usando <staff>.
6. TEXTO Y LETRAS: Transcribe letras de canciones (lyrics) y marcas de tempo (ej: Allegro, Quarter Note = 120).
7. REGLA DE SALIDA: Devuelve ÚNICAMENTE el código MusicXML 4.0 válido. No incluyas explicaciones ni bloques de código markdown.
8. INTEGRIDAD RÍTMICA: Asegúrate de que la suma de las duraciones en cada compás coincida exactamente con el numerador del compás.

Si la imagen es compleja o tiene ruido, utiliza tus conocimientos de teoría musical para deducir la intención lógica del compositor.`;

export async function processSheetMusic(base64Image: string, mimeType: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType.includes('pdf') ? 'application/pdf' : mimeType,
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          { text: "Realiza un escaneo OMR profesional de esta partitura. Convierte cada signo musical, dinámica y texto en un archivo MusicXML 4.0 perfecto. Genera el código XML completo." }
        ],
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1, // Baja temperatura para máxima precisión estructural
      },
    });

    let xmlText = response.text || '';
    
    // Limpieza profunda de la respuesta
    xmlText = xmlText.replace(/^```xml/g, '')
                    .replace(/^```/g, '')
                    .replace(/```$/g, '')
                    .trim();
                    
    if (!xmlText.startsWith('<?xml')) {
      const firstXmlIndex = xmlText.indexOf('<?xml');
      if (firstXmlIndex !== -1) {
        xmlText = xmlText.substring(firstXmlIndex);
      }
    }

    return xmlText;
  } catch (error: any) {
    console.error("Gemini OMR Error:", error);
    throw new Error("Error en el escaneo profesional. Por favor, asegúrate de que la iluminación sea uniforme y los signos sean legibles.");
  }
}
