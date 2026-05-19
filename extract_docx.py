import zipfile
import xml.etree.ElementTree as ET
import os

def extract_docx_text(docx_path):
    print(f"Opening {docx_path}...")
    try:
        with zipfile.ZipFile(docx_path) as docx:
            # The XML namespaces used in Word documents
            namespaces = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            }
            
            # Read word/document.xml which contains the main text content
            document_xml = docx.read('word/document.xml')
            root = ET.fromstring(document_xml)
            
            paragraphs = []
            # Find all paragraph elements <w:p>
            for paragraph in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
                # Gather text from text runs <w:r>/<w:t>
                text_runs = []
                for run in paragraph.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                    if run.text:
                        text_runs.append(run.text)
                
                paragraph_text = "".join(text_runs)
                if paragraph_text.strip():
                    paragraphs.append(paragraph_text.strip())
            
            return paragraphs
    except Exception as e:
        print(f"Error parsing docx: {e}")
        return []

def main():
    downloads_dir = "c:\\Users\\PC\\Downloads"
    files = [
        "Perguntas _ Respostas - Assessment.docx",
        "Perguntas _ Respostas - Assessment2.docx"
    ]
    
    for f in files:
        full_path = os.path.join(downloads_dir, f)
        if os.path.exists(full_path):
            paragraphs = extract_docx_text(full_path)
            print(f"Extracted {len(paragraphs)} paragraphs from {f}")
            
            # Save the text to a .txt file so we can view it
            out_name = f.replace(" ", "_").replace(".docx", "_extracted.txt")
            out_path = os.path.join("c:\\Users\\PC\\Downloads\\TalentoIA", out_name)
            with open(out_path, "w", encoding="utf-8") as out_f:
                for p in paragraphs:
                    out_f.write(p + "\n")
            print(f"Saved to {out_path}")
        else:
            print(f"File does not exist: {full_path}")

if __name__ == "__main__":
    main()
