import { Document, Page, renderToBuffer } from "@react-pdf/renderer";
import type { ResumeDraft } from "@/lib/resume/types";
import { PDF_FONT, PAGE_PADDING } from "./shared";
import { MinimalPdf } from "@/components/pdf/MinimalPdf";
import { ProfessionalPdf } from "@/components/pdf/ProfessionalPdf";
import { ModernPdf } from "@/components/pdf/ModernPdf";
import { ExecutivePdf } from "@/components/pdf/ExecutivePdf";
import { InternationalPdf } from "@/components/pdf/InternationalPdf";
import { CompactPdf } from "@/components/pdf/CompactPdf";
import { TechnicalPdf } from "@/components/pdf/TechnicalPdf";
import { AcademicPdf } from "@/components/pdf/AcademicPdf";
import { PortfolioPdf } from "@/components/pdf/PortfolioPdf";
import { BoldPdf } from "@/components/pdf/BoldPdf";
import { GraduatePdf } from "@/components/pdf/GraduatePdf";

const pdfComponents = {
  minimal: MinimalPdf,
  professional: ProfessionalPdf,
  modern: ModernPdf,
  executive: ExecutivePdf,
  international: InternationalPdf,
  compact: CompactPdf,
  technical: TechnicalPdf,
  academic: AcademicPdf,
  portfolio: PortfolioPdf,
  bold: BoldPdf,
  graduate: GraduatePdf,
} satisfies Record<ResumeDraft["templateKey"], unknown>;

export async function renderResumePdf(draft: ResumeDraft): Promise<Buffer> {
  const Template = pdfComponents[draft.templateKey];

  const doc = (
    <Document title={`${draft.contact.name || "Resume"} — Resume`}>
      <Page size="A4" style={{ padding: PAGE_PADDING, fontFamily: PDF_FONT }}>
        <Template content={draft} appearance={draft.appearance} />
      </Page>
    </Document>
  );

  return renderToBuffer(doc);
}
