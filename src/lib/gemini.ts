import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `Sen "The Pitt - Travma Simülasyonu" adlı bağımsız oyunun Baş Proje Yöneticisi, Zaman Planlayıcısı ve Teknik Sanatçısısın.

PROJE BİLGİLERİ:
- Oyun Motoru: Unity 5
- Modelleme: Blender Python Procedural Generation
- Mimari Standartlar: 0.22m duvar kalınlığı, 2.15m kapı yüksekliği
- Sanat Yönetimi: The Pitt stili (soluk hastane kremi duvarlar, koyu gri epoksi zemin, Pittsburgh sarı/siyah tehlike şeritleri, florasan ışıklar, tavan ray sistemi Trauma Tower)
- Oyun Konsepti: Amerikan Seviye 1 Travma Merkezi, 24 saatlik döngü (12 saat hastane fazı + 12 saat sivil hayat fazı), izometrik + FPS karma kamera, ATLS/ABCDE protokolü, kelebek etkisi mekanik, 50 otonom NPC personel

GÖREV İÇİN BAĞLAM: Kullanıcının müsaitlik durumuna ve proje ilerlemesine bakarak, bugün için bitirilebilir, mantıksal sıraya oturtulmuş, spesifik 3-4 maddelik checklist üretirsin, soruları yanıtlarsın ve Python kodları yazarsın.`;

export type AITask = { text: string; done: boolean };

export async function generateDailyPlan(prompt: string): Promise<AITask[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + "\nGÖREV: Günlük planlama checklist'i oluştur. Sadece şemaya uygun dizi döndür.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
                description: "Maddenin kısa, net ve teknik açıklaması."
              }
            },
            required: ["text"]
          }
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      return parsed.map((item: any) => ({
        text: item.text,
        done: false
      }));
    }
    return [];
  } catch (err) {
    console.error("AI Plan Generation Error:", err);
    throw err;
  }
}

export type ChatMessage = { role: "user" | "model"; content: string };

export async function sendMessage(history: ChatMessage[], newMessage: string): Promise<string> {
  try {
    const combinedPrompt = history.map(m => `${m.role === 'user' ? 'Geliştirici' : 'AI'}: ${m.content}`).join('\n') + `\nGeliştirici: ${newMessage}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: combinedPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + "\nEğer kullanıcı kod veya model isterse, doğrudan Python kodu ver. Konuşurken teknik, vizyoner ve motive eici ol."
      }
    });
    
    return response.text || "";
  } catch (err) {
    console.error("Chat Error:", err);
    return "AI iletişim modülü arızalandı.";
  }
}

export async function generateCSharpArchitecture(prompt: string): Promise<string> {
   try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Geliştirici Unity C# için şu sistemin mimari parçasını istiyor: ${prompt}
Lütfen hangi scriptlerin (örn: PatientVital.cs, TriageManager.cs) açılması gerektiğini, tekil sorumluluk prensibini (SRP) gözeterek ve scriptlerin birbiriyle nasıl konuşacağını (Events, Singleton, Injection vb.) Markdown formatında açıkla. Bol bol The Pitt tarzı spesifik Unity ipucu ver. Asla tam kodu yazma, sadece mimari planı (script adları, ana variable'lar ve method isimleri) çıkar.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "Mimari üretilemedi.";
  } catch (err) {
    console.error("C# Architecture Error:", err);
    return "AI Mimari modülü arızalandı.";
  }
}

export async function generateBlenderCode(prompt: string): Promise<string> {
   try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Geliştirici şu objenin procedürel Blender Python kodunu istiyor: ${prompt}\nLütfen SADECE Python kodunu Markdown formunda \`\`\`python ... \`\`\` olarak ver. Başka hiçbir açıklama yapma. "The Pitt" kurallarına (0.22m duvar, 2.15m kapı vb. ve materyaller) uysun.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    
    const text = response.text || "";
    const match = text.match(/```python([\s\S]*?)```/);
    return match ? match[1].trim() : text.trim();
  } catch (err) {
    console.error("Blender Generation Error:", err);
    return "print('Error generating Blender standard code.')";
  }
}
