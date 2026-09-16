import type { TemplateKey } from "@/lib/resume/types";
import { MinimalTemplate } from "./MinimalTemplate";
import { ProfessionalTemplate } from "./ProfessionalTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { ExecutiveTemplate } from "./ExecutiveTemplate";
import { InternationalTemplate } from "./InternationalTemplate";
import { CompactTemplate } from "./CompactTemplate";
import { TechnicalTemplate } from "./TechnicalTemplate";
import { AcademicTemplate } from "./AcademicTemplate";
import { PortfolioTemplate } from "./PortfolioTemplate";
import { BoldTemplate } from "./BoldTemplate";
import { GraduateTemplate } from "./GraduateTemplate";

export const templateComponents = {
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  modern: ModernTemplate,
  executive: ExecutiveTemplate,
  international: InternationalTemplate,
  compact: CompactTemplate,
  technical: TechnicalTemplate,
  academic: AcademicTemplate,
  portfolio: PortfolioTemplate,
  bold: BoldTemplate,
  graduate: GraduateTemplate,
} satisfies Record<TemplateKey, unknown>;

export { TemplateCanvas } from "./TemplateCanvas";
export { templateCatalog, getTemplateMeta } from "./catalog";
