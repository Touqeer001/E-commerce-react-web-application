import "./Policy.css";

const PrivacyPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Privacy Policy</h1>

        <p className="policy-intro">
          This Privacy Policy explains how we collect, use, store, and protect
          your personal information when you access or use our website and
          services.
        </p>

        <section className="policy-section">
          <h2>Information We Collect</h2>
          <ul>
            <li>Name</li>
            <li>Phone Number</li>
            <li>Address</li>
            <li>Email Address</li>
            <li>Age & Gender</li>
            <li>Location & Language</li>
            <li>Date of Birth</li>
            <li>Shopping Interests & Preferences</li>
            <li>PAN / GST Details (where applicable)</li>
            <li>Government Issued ID & KYC Details</li>
            <li>Browsing History</li>
            <li>Buying Behaviour</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>How We Use Your Information</h2>
          <ul>
            <li>Process and deliver your orders.</li>
            <li>Provide customer support.</li>
            <li>Recommend relevant products and services.</li>
            <li>Improve website performance and user experience.</li>
            <li>Resolve complaints and payment disputes.</li>
            <li>Communicate via Email, SMS, or Phone regarding your orders.</li>
          </ul>
        </section>

        <section className="policy-section">
          <h2>Cookies</h2>
          <p>
            We use cookies and similar technologies to improve your browsing
            experience, remember your preferences, analyze website traffic, and
            deliver personalized advertisements. You can disable cookies
            through your browser settings, although some website features may
            not function properly.
          </p>
        </section>

        <section className="policy-section">
          <h2>Your Consent</h2>
          <p>
            By accessing or using our website, you consent to the collection,
            storage, and use of your information in accordance with this Privacy
            Policy.
          </p>
          <p>
            You may request to review, update, or withdraw your consent by
            contacting us through the email provided below.
          </p>
        </section>

        <section className="policy-section">
          <h2>Disclosure of Information</h2>
          <p>
            Your information may be shared with trusted service providers,
            affiliates, logistics partners, or government authorities whenever
            required by law or for providing our services.
          </p>
        </section>

        <section className="policy-section">
          <h2>Security</h2>
          <p>
            We follow industry-standard security practices to protect your
            personal information. While we take reasonable measures to secure
            your data, no online system can guarantee complete security.
          </p>
        </section>

        <section className="policy-section">
          <h2>Grievance Officer</h2>

          <p>
            <strong>Mr. Prem Kumar</strong>
            <br />
            Grievance Officer
            <br />
            Vaishnavi Properties,
            <br />
            #30/1, Silicon Terraces,
            <br />
            2nd & 3rd Floor,
            <br />
            Adugodi, Hosur Main Road,
            <br />
            Koramangala,
            <br />
            Bengaluru – 560095
          </p>

          <p>
            <strong>Email:</strong> grievance@dennislingo.com
          </p>
        </section>

        <section className="policy-section">
          <h2>Policy Updates</h2>
          <p>
            We reserve the right to modify this Privacy Policy at any time.
            Updated versions will be published on this page. We encourage you
            to review this policy periodically.
          </p>
        </section>

        <section className="policy-section note">
          <h2>Contact Us</h2>
          <p>
            If you have any questions regarding this Privacy Policy or your
            personal information, please contact our support team through the
            official grievance email mentioned above.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;