import { Prose } from "../Prose";

export function TailorResumeToJobDescription() {
  return (
    <Prose>
      <p>
        Most resumes fail for a boring reason: they&rsquo;re written for
        every job at once, which means they&rsquo;re really written for
        none of them. A resume that lists everything you&rsquo;ve ever done,
        in the order you did it, forces the reader to do the work of
        figuring out what&rsquo;s relevant. Tailoring just means doing that
        work for them.
      </p>

      <h2>Start with the posting, not your resume</h2>
      <p>
        Read the job description and underline anything that repeats — a
        skill mentioned in both the requirements and the day-to-day
        responsibilities is a strong signal of what the team actually cares
        about. Job postings are also often written or lightly edited by the
        hiring manager, so the exact words they use tend to matter more than
        you&rsquo;d think.
      </p>

      <h2>Match the wording, not just the meaning</h2>
      <p>
        If a posting asks for &ldquo;stakeholder management&rdquo; and your
        resume says &ldquo;worked closely with clients,&rdquo; a person
        might read those as equivalent — but a keyword-based screen, or a
        recruiter skimming for three seconds, might not connect them.
        Where it&rsquo;s honestly accurate, use the posting&rsquo;s own
        terms.
      </p>

      <h2>Reorder before you rewrite</h2>
      <p>
        The fastest improvement is usually reordering, not rewriting. Put
        your most relevant bullet first under each job, not necessarily the
        most impressive one overall. A recruiter scanning in seconds reads
        top to bottom and often doesn&rsquo;t get past the first two lines
        of each role.
      </p>

      <h2>Cut what isn&rsquo;t pulling weight</h2>
      <p>
        Every bullet point that isn&rsquo;t relevant to this specific job is
        competing for attention with one that is. A ten-year-old internship
        bullet about a tool you never use anymore is usually better left
        off, even if it technically still &ldquo;fits&rdquo; on the page.
      </p>

      <h2>Never invent what isn&rsquo;t there</h2>
      <p>
        Tailoring is about emphasis, not fabrication. If a posting wants
        experience you don&rsquo;t have, don&rsquo;t manufacture a bullet
        that implies you do — it tends to fall apart in an interview, and
        it&rsquo;s not worth the risk. Emphasize the closest real experience
        instead.
      </p>

      <h2>Doing this by hand for every application is exhausting</h2>
      <p>
        This is exactly why we built the{" "}
        <a href="/master-resume" className="text-accent hover:text-accent-hover">
          Master Resume
        </a>{" "}
        feature: keep one complete record of everything you&rsquo;ve done,
        then generate a version for a specific job description. It does the
        first pass — pulling the most relevant bullets and skills — so
        you&rsquo;re editing a head start instead of starting from a blank
        page.
      </p>
    </Prose>
  );
}
