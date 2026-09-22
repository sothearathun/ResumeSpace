import { PDFDocument } from "pdf-lib";

/** Counts pages in a PDF buffer using a real parser rather than scanning
 * raw bytes for `/Type /Page` — a regex heuristic looked reliable in
 * testing but breaks the moment the PDF embeds binary content (an uploaded
 * photo's compressed image stream can coincidentally contain those exact
 * ASCII bytes, producing a wrong count). */
export async function countPdfPages(buffer: Buffer): Promise<number> {
  const doc = await PDFDocument.load(buffer);
  return doc.getPageCount();
}
