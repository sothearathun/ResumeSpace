import { Prose } from "../Prose";

export function WhatIsAMasterResume() {
  return (
    <Prose>
      <p>
        A master resume is the version of your resume nobody ever sees:
        one document with every job, every bullet point, every skill
        you&rsquo;ve picked up — no length limit, no attempt to make it fit
        on one page. Every resume you actually send is a smaller, edited
        version of it.
      </p>

      <h2>Why keep one at all</h2>
      <p>
        Two reasons, mainly. First, speed — when a new posting shows up, you
        already have the raw material and you&rsquo;re editing instead of
        remembering. Second, memory — six months after a project ends, the
        specifics fade. A master resume is where you write things down
        while they&rsquo;re still fresh, even if the achievement doesn&rsquo;t
        fit anywhere on your current one-page resume.
      </p>

      <h2>What goes in it</h2>
      <ul>
        <li>Every job, including short ones and ones that feel irrelevant now</li>
        <li>Every bullet point you&rsquo;ve ever written for any version of your resume</li>
        <li>Every skill, tool, and piece of software you&rsquo;ve used, not just the ones you&rsquo;d lead with</li>
        <li>Side projects, volunteer work, certifications — anything you might need for a specific application later</li>
      </ul>
      <p>
        The point isn&rsquo;t to make this document good. It&rsquo;s to make
        it complete. Editing down is much easier than trying to recall
        something you never wrote down.
      </p>

      <h2>How it actually gets used</h2>
      <p>
        When you&rsquo;re applying somewhere specific, you go the other
        direction: pull only what&rsquo;s relevant to that job, cut
        everything else, and reorder so the most relevant material is
        first. The master resume doesn&rsquo;t replace tailoring — it&rsquo;s
        what makes tailoring fast, because you&rsquo;re never starting from
        nothing.
      </p>

      <h2>How this works on ResumeCraft</h2>
      <p>
        The{" "}
        <a href="/master-resume" className="text-accent hover:text-accent-hover">
          Master Resume
        </a>{" "}
        page is built for exactly this — one place to keep everything,
        separate from any resume you&rsquo;d actually send. When you&rsquo;re
        ready to apply somewhere, paste in the job description and generate
        a resume from it: the most relevant experience and skills get
        pulled out and reordered automatically, using a plain relevance
        match against your own content rather than inventing anything new.
        You still pick the template and make the final edits — it just
        skips the blank-page part.
      </p>
    </Prose>
  );
}
