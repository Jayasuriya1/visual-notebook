import { StudyTextbook } from '../types';

/**
 * Generates an editorial-grade, ADHD-hyperlegible Markdown document
 * with full source attribution, timestamps, tables, and Mermaid flowcharts.
 */
export function generateTextbookMarkdown(textbook: StudyTextbook): string {
  const videoUrl =
    textbook.videoUrl ||
    (textbook.videoId ? `https://www.youtube.com/watch?v=${textbook.videoId}` : '');

  const lines: string[] = [];

  // Frontmatter / Title
  lines.push(`# ${textbook.videoTitle}`);
  lines.push(`**ADHD Visual Study Textbook & Master Protocol**\n`);

  // Source Metadata Block
  lines.push(`---`);
  lines.push(`## 📌 Source Metadata & Video Attribution\n`);
  if (videoUrl) {
    lines.push(`- **Source Video URL:** [${videoUrl}](${videoUrl})`);
  }
  lines.push(`- **Keynote Speaker / Channel:** ${textbook.speaker || 'Unknown'}`);
  if (textbook.videoId) {
    lines.push(`- **YouTube Video ID:** \`${textbook.videoId}\``);
  }
  lines.push(`- **Duration:** ${textbook.duration || 'Full Lecture'}`);
  lines.push(`- **Textbook Edition:** ${textbook.generatedAt || new Date().toISOString().split('T')[0]}`);
  lines.push(`- **Visual Chapters:** ${textbook.chapters.length} Modules`);
  lines.push(`- **Format:** High-Contrast ADHD Hyperlegible Markdown (Obsidian / Notion / GitHub / Logseq compatible)`);
  lines.push(`---\n`);

  // Executive Synthesis
  lines.push(`## 📑 Executive Synthesis\n`);
  lines.push(`> ${textbook.executiveSummary.replace(/\n/g, '\n> ')}\n`);

  // Master Knowledge Mindmap
  if (textbook.masterMindmapMermaid && textbook.masterMindmapMermaid.trim()) {
    lines.push(`## 🗺️ Master Knowledge Mindmap\n`);
    lines.push('```mermaid');
    lines.push(textbook.masterMindmapMermaid.trim());
    lines.push('```\n');
  }

  // Chapters
  textbook.chapters.forEach((chapter, index) => {
    lines.push(`---\n`);
    lines.push(`# CHAPTER ${chapter.chapterNumber || index + 1}: ${chapter.title}\n`);

    // Chapter Timestamp with Direct YouTube Jump Link
    let chapterTimeLink = '';
    if (textbook.videoId && typeof chapter.startSeconds === 'number') {
      const tsUrl = `https://www.youtube.com/watch?v=${textbook.videoId}&t=${chapter.startSeconds}s`;
      chapterTimeLink = ` • [▶ Jump to ${chapter.timestampRange} on YouTube](${tsUrl})`;
    }
    lines.push(`> **Timestamp:** \`${chapter.timestampRange}\`${chapterTimeLink}\n`);

    // Core Concepts
    lines.push(`### 🎯 Core Concepts & Mechanisms\n`);
    if (chapter.anchorKeywords && chapter.anchorKeywords.length > 0) {
      const keywordPills = chapter.anchorKeywords.map((k) => `\`${k}\``).join(' ');
      lines.push(`**Anchor Keywords:** ${keywordPills}\n`);
    }
    if (chapter.coreConcepts && chapter.coreConcepts.length > 0) {
      chapter.coreConcepts.forEach((concept) => {
        lines.push(`- ${concept}`);
      });
      lines.push('');
    }

    // Mental Model
    if (chapter.mentalModelTitle || chapter.mentalModelExplanation) {
      lines.push(`### 🧠 Mental Model: ${chapter.mentalModelTitle || 'Story Analogy'}\n`);
      lines.push(`> ${chapter.mentalModelExplanation.replace(/\n/g, '\n> ')}\n`);
    }

    // Mermaid Diagram
    if (chapter.mermaidDiagram && chapter.mermaidDiagram.trim()) {
      lines.push(`### 📊 Visual Mechanism Flowchart\n`);
      lines.push('```mermaid');
      lines.push(chapter.mermaidDiagram.trim());
      lines.push('```\n');
    }

    // The Trap
    if (chapter.theTrap?.title || chapter.theTrap?.description) {
      lines.push(`### ⚠️ The Trap / Failure Point: ${chapter.theTrap.title}\n`);
      lines.push(`${chapter.theTrap.description}\n`);
    }

    // Immediate Action Steps
    if (chapter.actionSteps && chapter.actionSteps.length > 0) {
      lines.push(`### ⚡ Immediate Action Protocol\n`);
      chapter.actionSteps.forEach((step, stepIdx) => {
        lines.push(`${stepIdx + 1}. ${step}`);
      });
      lines.push('');
    }

    // Comparison Table
    if (
      chapter.comparisonTable?.headers?.length &&
      chapter.comparisonTable?.rows?.length
    ) {
      lines.push(`### 📋 Comparative Analysis\n`);
      const headers = chapter.comparisonTable.headers.map((h) =>
        h.replace(/\|/g, '\\|').trim()
      );
      lines.push(`| ${headers.join(' | ')} |`);
      lines.push(`| ${headers.map(() => '---').join(' | ')} |`);

      chapter.comparisonTable.rows.forEach((row) => {
        const cleanRow = row.map((cell) =>
          cell.replace(/\|/g, '\\|').replace(/\n/g, '<br/>').trim()
        );
        lines.push(`| ${cleanRow.join(' | ')} |`);
      });
      lines.push('');
    }

    // Checkable Takeaways
    if (chapter.checkableTakeaways && chapter.checkableTakeaways.length > 0) {
      lines.push(`### ✍️ Checkable Chapter Takeaways & Action Rules\n`);
      chapter.checkableTakeaways.forEach((item) => {
        const checkbox = item.checked ? '[x]' : '[ ]';
        const tag = item.category ? `**[${item.category}]** ` : '';
        const time = item.timestamp ? ` *(\`${item.timestamp}\`)*` : '';
        lines.push(`- ${checkbox} ${tag}${item.text}${time}`);
      });
      lines.push('');
    }
  });

  // Footer Attribution
  lines.push(`---\n`);
  lines.push(`*Generated by **YouTube to ADHD Visual Textbook & A4 PDF Generator***`);
  if (videoUrl) {
    lines.push(`*Original YouTube Lecture: [${videoUrl}](${videoUrl})*`);
  }

  return lines.join('\n');
}

/**
 * Initiates direct browser file download for the study textbook in Markdown (.md) format.
 */
export function downloadTextbookMarkdown(textbook: StudyTextbook): void {
  const markdownContent = generateTextbookMarkdown(textbook);
  const cleanTitle = textbook.videoTitle.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40) || 'StudyGuide';
  const filename = `${cleanTitle}_ADHD_Textbook.md`;

  const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
