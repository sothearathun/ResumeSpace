import { Prose } from "../Prose";

export function AtsFriendlyResumeGuide() {
  return (
    <Prose>
      <p>
        &ldquo;ATS-friendly&rdquo; gets thrown around a lot, often to mean
        something vague like &ldquo;good.&rdquo; What it actually refers to
        is narrower: whether an applicant tracking system can correctly pull
        the text out of your resume file and place it in the right fields.
        Most of what determines that is layout, not keywords.
      </p>

      <h2>What actually breaks parsing</h2>
      <p>
        Modern ATS software is decent at reading plain text. It struggles
        with structure it can&rsquo;t map to a linear reading order:
      </p>
      <ul>
        <li>
          <strong>Multi-column layouts</strong> — some parsers read straight
          across the page, mixing your left-column skills list into the
          middle of your right-column experience.
        </li>
        <li>
          <strong>Tables</strong> — content inside table cells is sometimes
          skipped entirely, depending on the parser.
        </li>
        <li>
          <strong>Text inside images or icons</strong> — if it&rsquo;s not
          real text, it isn&rsquo;t extracted. A phone icon next to your
          number is fine; your job title rendered as an image is not.
        </li>
        <li>
          <strong>Headers and footers</strong> — contact information placed
          there is sometimes dropped, since not all parsers read them.
        </li>
      </ul>

      <h2>What doesn&rsquo;t actually matter as much as people think</h2>
      <p>
        You don&rsquo;t need to stuff keywords in white text (some systems
        flag this as manipulation, and it does nothing for a human
        reviewer). You also don&rsquo;t need a specific font size or a
        magic keyword density — a resume that reads naturally to a person
        and uses the language of the job posting where it&rsquo;s honestly
        accurate will cover most of what a screen is checking for.
      </p>

      <h2>A simple checklist</h2>
      <ul>
        <li>Single column, or a two-column layout only for roles that don&rsquo;t get screened automatically</li>
        <li>Standard section headings — &ldquo;Experience,&rdquo; &ldquo;Education,&rdquo; &ldquo;Skills&rdquo;</li>
        <li>Dates and contact details as real text, not inside a graphic</li>
        <li>PDF is fine for the vast majority of modern systems, unless the posting specifically asks for Word</li>
        <li>A photo doesn&rsquo;t break parsing on its own, but a layout built around one sometimes does</li>
      </ul>

      <h2>Where this fits with templates</h2>
      <p>
        On ResumeCraft, templates carry an ATS-friendly badge when they&rsquo;re
        single-column with standard headings — Minimal, Professional,
        Executive, Compact, Technical, Academic CV, and Graduate all qualify.
        Templates with a header band, a persistent sidebar, or a photo —
        Modern, International, Portfolio, Bold — trade some of that parsing
        safety for visual presence, which is the right call for roles that
        are reviewed by a person first, not a machine.
      </p>
    </Prose>
  );
}
