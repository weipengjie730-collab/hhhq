const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_BASE_URL = "https://api.openai.com/v1";

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const seed = String(req.body?.seed || "").trim();
  if (!seed) {
    res.status(400).json({ error: "Missing seed" });
    return;
  }

  try {
    const comic = process.env.AI_API_KEY
      ? await generateWithModel(seed)
      : buildFallbackComic(seed, "missing_api_key");

    res.status(200).json(comic);
  } catch (error) {
    console.error("generate-comic failed", error);
    res.status(200).json(buildFallbackComic(seed, "api_error"));
  }
};

function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function generateWithModel(seed) {
  const baseUrl = (process.env.AI_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
  const model = process.env.AI_MODEL || DEFAULT_MODEL;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.AI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.8,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "你是 PanelForge 的漫画脚本 Agent。只输出 JSON，不要 Markdown。JSON 必须包含 story 和 panels。panels 必须正好 4 项，每项包含 title, scene, dialogue。内容适合轻量 4 格短篇漫画，中文，安全，具体，可画。",
        },
        {
          role: "user",
          content: `把这一句话扩写成 4 格漫画脚本：${seed}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content || "{}");
  return normalizeComic(parsed, seed);
}

function normalizeComic(raw, seed) {
  const fallback = buildFallbackComic(seed, "invalid_ai_shape");
  const panels = Array.isArray(raw.panels) ? raw.panels.slice(0, 4) : [];

  if (panels.length !== 4) {
    return fallback;
  }

  return {
    source: "agent",
    story: String(raw.story || fallback.story).slice(0, 500),
    panels: panels.map((panel, index) => ({
      title: String(panel.title || `第 ${index + 1} 格`).slice(0, 40),
      scene: String(panel.scene || fallback.panels[index].scene).slice(0, 180),
      dialogue: String(panel.dialogue || fallback.panels[index].dialogue).slice(0, 36),
    })),
  };
}

function buildFallbackComic(seed, reason) {
  return {
    source: "fallback",
    reason,
    story: `围绕「${seed}」，系统补齐为一个轻量短篇：主角遇到意外状况，先困惑，再发现关键反转，最后得到一个适合发布的温暖收束。`,
    panels: [
      {
        title: "第 1 格：事件发生",
        scene: `主角进入场景：${seed}。画面先交代天气、地点和情绪。`,
        dialogue: "咦，发生什么了？",
      },
      {
        title: "第 2 格：发现异常",
        scene: "主角注意到一个不符合常理的小细节，故事开始转向。",
        dialogue: "等等，你刚才说话了吗？",
      },
      {
        title: "第 3 格：情绪反转",
        scene: "误会或紧张被解开，角色之间出现一个可爱的互动。",
        dialogue: "原来你是在等我。",
      },
      {
        title: "第 4 格：收束成稿",
        scene: "故事落在一个适合截图分享的结尾，保留一点余味。",
        dialogue: "那就一起回家吧。",
      },
    ],
  };
}
