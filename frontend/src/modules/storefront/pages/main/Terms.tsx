import { PolicyLayout } from "./PolicyLayout";

export function Terms() {
  return (
    <PolicyLayout
      title="Terms of Service"
      lastUpdated="October 24, 2024"
      showContact={true}
    >
      <section>
        <h2>
          <span className="text-blue-600 mr-1">1.</span> Agreement to Terms
        </h2>
        <p>
          By accessing or using our services, you agree to be bound by these
          Terms. If you disagree with any part of the terms, then you do not
          have permission to access the Service. These terms apply to all
          visitors, users, and others who access or use the Service.
        </p>
      </section>

      <section>
        <h2>
          <span className="text-blue-600 mr-1">2.</span> Account
          Responsibilities
        </h2>
        <p>
          When you create an account with us, you must provide information that
          is accurate, complete, and current at all times. Failure to do so
          constitutes a breach of the Terms, which may result in immediate
          termination of your account on our Service.
        </p>
        <ul className="list-disc pl-6 space-y-3">
          <li>
            You are responsible for safeguarding the password that you use to
            access the Service.
          </li>
          <li>
            You agree not to disclose your password to any third party.
          </li>
          <li>
            You must notify us immediately upon becoming aware of any breach of
            security or unauthorized use of your account.
          </li>
        </ul>
      </section>

      <section>
        <h2>
          <span className="text-blue-600 mr-1">3.</span> Intellectual Property
        </h2>
        <p>
          The Service and its original content, features, and functionality are
          and will remain the exclusive property of Stellar Commerce and its
          licensors. The Service is protected by copyright, trademark, and other
          laws of both the United States and foreign countries. Our trademarks
          and trade dress may not be used in connection with any product or
          service without the prior written consent of Stellar Commerce.
        </p>
      </section>

      <section>
        <h2>
          <span className="text-blue-600 mr-1">4.</span> Termination
        </h2>
        <p>
          We may terminate or suspend your account immediately, without prior
          notice or liability, for any reason whatsoever, including without
          limitation if you breach the Terms. Upon termination, your right to
          use the Service will immediately cease. If you wish to terminate your
          account, you may simply discontinue using the Service.
        </p>
      </section>
    </PolicyLayout>
  );
}