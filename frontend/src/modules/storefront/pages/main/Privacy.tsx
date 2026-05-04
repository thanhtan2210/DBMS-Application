import { PolicyLayout } from "./PolicyLayout";
import { Check } from "lucide-react";

export function Privacy() {
  const sections = [
    { id: "intro", title: "1. Introduction" },
    { id: "collect", title: "2. Information We Collect" },
    { id: "use", title: "3. How We Use Information" },
    { id: "share", title: "4. Sharing Your Information" },
    { id: "rights", title: "5. Your Privacy Rights" },
    { id: "security", title: "6. Data Security" },
    { id: "contact", title: "7. Contact Us" },
  ];

  return (
    <PolicyLayout
      title="Privacy Policy"
      lastUpdated="October 26, 2024"
      noProse
      showContact={true}
    >
      <div className="flex flex-col lg:flex-row gap-0">
        {/* Sidebar */}
        <aside className="lg:w-[240px] shrink-0 border-b lg:border-b-0 lg:border-r border-[#e4eaf0] p-8 lg:p-10 bg-[#fbfcfd]">
          <div className="lg:sticky lg:top-32">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#8fa3b0] mb-5">
              Table of Contents
            </h4>
            <nav className="flex flex-col gap-4">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-[13px] font-medium text-[#4a6076] hover:text-[#112d4e] transition-colors leading-snug"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div
          className="flex-grow p-8 lg:p-14 prose prose-slate max-w-none
            prose-h2:text-[24px] prose-h2:font-bold prose-h2:text-[#112d4e] prose-h2:mb-5 prose-h2:mt-12 first:prose-h2:mt-0
            prose-p:text-[#4a5e6d] prose-p:text-[15px] prose-p:leading-[1.8] prose-p:mb-6
            prose-strong:text-[#112d4e] prose-strong:font-semibold
            prose-li:text-[#4a5e6d] prose-li:text-[15px] prose-li:leading-[1.8] prose-li:mb-2
            prose-ul:mb-8 prose-ul:mt-4"
        >
          <section id="intro" className="scroll-mt-28">
            <h2>1. Introduction</h2>
            <p>
              Welcome to Stellar Commerce. We respect your privacy and are
              committed to protecting your personal data. This privacy policy
              will inform you as to how we look after your personal data when
              you visit our website (regardless of where you visit it from) and
              tell you about your privacy rights and how the law protects you.
            </p>
            <p>
              This privacy policy is provided in a layered format so you can
              click through to the specific areas set out below. Alternatively,
              you can download a pdf version of the policy here.
            </p>
          </section>

          <section id="collect" className="scroll-mt-28">
            <h2>2. Information We Collect</h2>
            <p>
              Personal data, or personal information, means any information
              about an individual from which that person can be identified. It
              does not include data where the identity has been removed
              (anonymous data).
            </p>
            <p>
              We may collect, use, store and transfer different kinds of
              personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5">
              <li>
                <strong>Identity Data</strong> includes first name, maiden name,
                last name, username or similar identifier, marital status,
                title, date of birth and gender.
              </li>
              <li>
                <strong>Contact Data</strong> includes billing address, delivery
                address, email address and telephone numbers.
              </li>
              <li>
                <strong>Financial Data</strong> includes bank account and
                payment card details.
              </li>
              <li>
                <strong>Transaction Data</strong> includes details about
                payments to and from you and other details of products and
                services you have purchased from us.
              </li>
              <li>
                <strong>Technical Data</strong> includes internet protocol (IP)
                address, your login data, browser type and version, time zone
                setting and location, browser plug-in types and versions,
                operating system and platform, and other technology on the
                devices you use to access this website.
              </li>
            </ul>
          </section>

          <section id="use" className="scroll-mt-28">
            <h2>3. How We Use Information</h2>
            <p>
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>

            <div className="bg-[#eef3f8] rounded-[10px] p-8 my-6 space-y-5 not-prose">
              {[
                "Where we need to perform the contract we are about to enter into or have entered into with you.",
                "Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.",
                "Where we need to comply with a legal obligation.",
              ].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 bg-[#3e5f8a] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white stroke-[3px]" />
                  </div>
                  <p className="text-[14px] text-[#4a5e6d] leading-relaxed">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="share" className="scroll-mt-28">
            <h2>4. Sharing Your Information</h2>
            <p>
              We may share your personal data with the parties set out below for
              the purposes set out in the table above.
            </p>
            <ul className="list-disc pl-5">
              <li>Internal Third Parties.</li>
              <li>External Third Parties.</li>
              <li>
                Third parties to whom we may choose to sell, transfer or merge
                parts of our business or our assets.
              </li>
            </ul>
          </section>

          <section id="rights" className="scroll-mt-28">
            <h2>5. Your Privacy Rights</h2>
            <p>
              Under certain circumstances, you have rights under data protection
              laws in relation to your personal data, including the right to
              request access, correction, erasure, restriction, transfer, to
              object to processing, to portability of data and (where the lawful
              ground of processing is consent) to withdraw consent.
            </p>
          </section>

          <section id="security" className="scroll-mt-28">
            <h2>6. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used or accessed in an
              unauthorized way, altered or disclosed. In addition, we limit
              access to your personal data to those employees, agents,
              contractors and other third parties who have a business need to
              know.
            </p>
          </section>

          <section id="contact" className="scroll-mt-28">
            <h2>7. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy
              practices, please contact our Data Privacy Manager at{" "}
              <a
                href="mailto:privacy@stellarcommerce.com"
                className="text-[#3e5f8a] hover:underline"
              >
                privacy@stellarcommerce.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </PolicyLayout>
  );
}