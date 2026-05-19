const fs = require('fs');
const path = require('path');

function extractTextFromDocumentXml(xmlPath, outPath) {
  if (!fs.existsSync(xmlPath)) {
    console.log(`File does not exist: ${xmlPath}`);
    return;
  }
  
  console.log(`Parsing ${xmlPath}...`);
  const content = fs.readFileSync(xmlPath, 'utf8');
  
  // A simple XML parser using regex for speed and ease (no npm dependencies needed)
  // We want to find each paragraph <w:p>...</w:p>
  const paragraphRegex = /<w:p(?:\s[^>]*?)?>([\s\S]*?)<\/w:p>/g;
  const textRegex = /<w:t(?:\s[^>]*?)?>([^<]*?)<\/w:t>/g;
  
  const paragraphs = [];
  let match;
  
  while ((match = paragraphRegex.exec(content)) !== null) {
    const pContent = match[1];
    const textRuns = [];
    let tMatch;
    
    // Reset regex index for safety
    textRegex.lastIndex = 0;
    while ((tMatch = textRegex.exec(pContent)) !== null) {
      textRuns.push(tMatch[1]);
    }
    
    const pText = textRuns.join('').trim();
    if (pText) {
      paragraphs.push(pText);
    }
  }
  
  fs.writeFileSync(outPath, paragraphs.join('\n'), 'utf8');
  console.log(`Saved ${paragraphs.length} paragraphs to ${outPath}`);
}

extractTextFromDocumentXml(
  path.join(__dirname, 'extracted_assessment', 'word', 'document.xml'),
  path.join(__dirname, 'assessment_text.txt')
);

extractTextFromDocumentXml(
  path.join(__dirname, 'extracted_assessment2', 'word', 'document.xml'),
  path.join(__dirname, 'assessment2_text.txt')
);
