const examples = document.querySelectorAll("[data-example]");
const input = document.querySelector("#story-input");
const generateBtn = document.querySelector("#generate-btn");
const loadingCard = document.querySelector("#loading-card");
const resultCard = document.querySelector("#result-card");
const expandedStory = document.querySelector("#expanded-story");
const comicGrid = document.querySelector("#comic-grid");
const exportBtn = document.querySelector("#export-btn");
const exportState = document.querySelector("#export-state");

const panelIcons = ["🌧️", "😺", "😳", "✨"];
let currentComic = null;

examples.forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.example || "";
    input.focus();
  });
});

generateBtn.addEventListener("click", async () => {
  const seed = input.value.trim();
  if (!seed) {
    input.focus();
    input.setAttribute("aria-invalid", "true");
    return;
  }

  input.removeAttribute("aria-invalid");
  resultCard.classList.add("is-hidden");
  loadingCard.classList.remove("is-hidden");
  generateBtn.disabled = true;
  generateBtn.textContent = "生成中...";

  try {
    const result = await generateComic(seed);
    renderResult(result);
  } catch (error) {
    console.warn("Falling back to mock comic", error);
    renderResult(buildMockComic(seed));
  } finally {
    loadingCard.classList.add("is-hidden");
    resultCard.classList.remove("is-hidden");
    generateBtn.disabled = false;
    generateBtn.textContent = "重新生成 4 格脚本";
    resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

exportBtn.addEventListener("click", () => {
  if (!currentComic) {
    exportState.textContent = "请先生成 4 格漫画预览。";
    return;
  }

  downloadComicPng(currentComic);
  exportState.textContent = "已下载 PNG，并完成一次 MVP 闭环：访问 -> 输入 -> 生成 -> 预览 -> 导出。";
});

function buildMockComic(seed) {
  return {
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

async function generateComic(seed) {
  const response = await fetch("/api/generate-comic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seed }),
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}`);
  }

  const comic = await response.json();
  if (!comic.story || !Array.isArray(comic.panels) || comic.panels.length !== 4) {
    throw new Error("Invalid comic payload");
  }
  return comic;
}

function renderResult(result) {
  currentComic = result;
  expandedStory.textContent = result.story;
  comicGrid.innerHTML = "";

  result.panels.forEach((panel, index) => {
    const article = document.createElement("article");
    article.className = "panel";
    article.innerHTML = `
      <div class="panel-art" aria-hidden="true">${panelIcons[index]}</div>
      <div class="panel-copy">
        <strong>${panel.title}</strong>
        <p>${panel.scene}</p>
        <span class="dialogue">${panel.dialogue}</span>
      </div>
    `;
    comicGrid.appendChild(article);
  });
}

function downloadComicPng(comic) {
  const canvas = document.createElement("canvas");
  const scale = Math.max(2, Math.floor(window.devicePixelRatio || 1));
  const width = 900;
  const height = 1500;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  drawExportImage(ctx, comic, width, height);

  const link = document.createElement("a");
  link.download = `panelforge-comic-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function drawExportImage(ctx, comic, width, height) {
  ctx.fillStyle = "#f7f3ee";
  ctx.fillRect(0, 0, width, height);

  roundedRect(ctx, 40, 36, width - 80, height - 72, 34, "#fffaf4", "#e3d8ca", 2);

  ctx.fillStyle = "#2f7f77";
  ctx.font = "700 26px system-ui, -apple-system, sans-serif";
  ctx.fillText("PanelForge MVP", 76, 92);

  ctx.fillStyle = "#211f1b";
  ctx.font = "800 48px system-ui, -apple-system, sans-serif";
  drawWrappedText(ctx, "一句话生成 4 格漫画", 76, 158, 720, 58, 2);

  ctx.fillStyle = "#736b61";
  ctx.font = "400 24px system-ui, -apple-system, sans-serif";
  drawWrappedText(ctx, comic.story, 76, 230, 748, 36, 3);

  const panelTop = 388;
  const panelGap = 22;
  const panelHeight = 220;
  comic.panels.forEach((panel, index) => {
    const y = panelTop + index * (panelHeight + panelGap);
    drawPanel(ctx, panel, index, 76, y, 748, panelHeight);
  });

  ctx.fillStyle = "#736b61";
  ctx.font = "700 22px system-ui, -apple-system, sans-serif";
  ctx.fillText("Made with PanelForge MVP · static launch flow practice", 76, height - 92);
}

function drawPanel(ctx, panel, index, x, y, width, height) {
  roundedRect(ctx, x, y, width, height, 26, "#ffffff", "#211f1b", 4);

  roundedRect(ctx, x + 22, y + 24, 152, height - 48, 22, "#f1e2d2", "#e3d8ca", 2);
  ctx.font = "700 58px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#211f1b";
  ctx.fillText(panelIcons[index], x + 98, y + height / 2);
  ctx.textAlign = "start";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#211f1b";
  ctx.font = "800 28px system-ui, -apple-system, sans-serif";
  drawWrappedText(ctx, panel.title, x + 202, y + 54, width - 236, 34, 1);

  ctx.fillStyle = "#736b61";
  ctx.font = "400 22px system-ui, -apple-system, sans-serif";
  drawWrappedText(ctx, panel.scene, x + 202, y + 96, width - 236, 32, 3);

  const bubbleY = y + height - 56;
  const bubbleWidth = Math.min(width - 236, ctx.measureText(panel.dialogue).width + 44);
  roundedRect(ctx, x + 202, bubbleY - 32, bubbleWidth, 46, 23, "#fffaf4", "#e3d8ca", 2);
  ctx.fillStyle = "#211f1b";
  ctx.font = "800 20px system-ui, -apple-system, sans-serif";
  ctx.fillText(panel.dialogue, x + 224, bubbleY - 2);
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const chars = String(text).split("");
  let line = "";
  let lineCount = 0;

  for (let i = 0; i < chars.length; i += 1) {
    const testLine = line + chars[i];
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && line) {
      lineCount += 1;
      const isLastLine = lineCount === maxLines;
      ctx.fillText(isLastLine && i < chars.length ? `${line.slice(0, -1)}…` : line, x, y);
      if (isLastLine) return;
      line = chars[i];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line && lineCount < maxLines) {
    ctx.fillText(line, x, y);
  }
}

function roundedRect(ctx, x, y, width, height, radius, fill, stroke, lineWidth) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();

  if (stroke && lineWidth) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}
