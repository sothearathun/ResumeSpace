import { Prose } from "../Prose";

export function ResumePhotoByCountry() {
  return (
    <Prose>
      <p>
        Whether to put a photo on your resume isn&rsquo;t really a design
        question — it&rsquo;s a regional norm, and getting it wrong in
        either direction can quietly hurt an application. Here&rsquo;s what
        the norms actually look like by region.
      </p>

      <h2>United States, Canada, UK, Australia</h2>
      <p>
        In these markets, leaving a photo off is standard, and it&rsquo;s
        often recommended against — mainly because of anti-discrimination
        norms in hiring. A photo doesn&rsquo;t typically help here, and on
        rare occasions a company&rsquo;s screening process will set aside
        resumes with photos entirely to avoid any appearance of bias in
        the process.
      </p>

      <h2>Much of continental Europe</h2>
      <p>
        Expectations vary noticeably by country. In Germany, Austria, and
        Spain, a professional photo is close to standard, and its absence
        can occasionally read as an incomplete application. In Belgium,
        Finland, Italy, Greece, and a number of other European countries,
        a photo is common but far more optional — leaving it off
        isn&rsquo;t a mark against you.
      </p>

      <h2>Japan, China, South Korea</h2>
      <p>
        A resume photo is still the norm in much of East Asia, particularly
        in more traditional industries, and skipping it can work against
        you. That said, international teams and modern industries within
        these markets are more flexible than a general job market average
        would suggest.
      </p>

      <h2>India, Malaysia, Singapore</h2>
      <p>
        These markets have become considerably more flexible, especially
        for roles at multinational companies or in tech — a photo is
        common but rarely a hard expectation either way.
      </p>

      <h2>The cross-border trend</h2>
      <p>
        As hiring has gotten more global, a growing number of multinational
        companies have moved toward photo-blind review specifically to
        keep evaluation consistent across markets with different local
        norms — even in countries where a photo would traditionally be
        expected. If you&rsquo;re applying to a global company rather than
        a strictly local one, that&rsquo;s worth factoring in.
      </p>

      <h2>The practical takeaway</h2>
      <p>
        Match the photo decision to where you&rsquo;re applying, not to
        where you&rsquo;re from or a single global default. On
        ResumeCraft, photo support is available on every template, but
        it&rsquo;s off by default on the ones built around US/UK-style
        applications — you can add or remove it per resume depending on
        who&rsquo;s actually going to read it.
      </p>

      <p className="text-[13px] text-text-secondary">
        Sources:{" "}
        <a
          href="https://stylingcv.com/should-you-include-a-photo-on-your-resume-2026/"
          className="text-accent hover:text-accent-hover"
        >
          StylingCV
        </a>
        ,{" "}
        <a
          href="https://airesume.guru/blog/international-resume-formats"
          className="text-accent hover:text-accent-hover"
        >
          US vs. European vs. Asian Resume Formats
        </a>
        .
      </p>
    </Prose>
  );
}
