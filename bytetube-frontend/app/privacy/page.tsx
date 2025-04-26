export default function Privacy() {
  return (
    <div className="min-h-screen bg-zinc-900 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-zinc-300">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information to provide better services to all our users. The information StreamView collects includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Information you provide to us (such as your name, email address)</li>
              <li>Information we get from your use of our services (such as device information, log information, and location information)</li>
              <li>Information from third-party sources as permitted by applicable law</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">2. How We Use Information</h2>
            <p className="mb-4">
              We use the information we collect from all our services to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Develop new services</li>
              <li>Protect StreamView and our users</li>
              <li>Offer personalized content</li>
              <li>Measure performance</li>
              <li>Communicate with you</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">3. Sharing Your Information</h2>
            <p className="mb-4">
              We do not share personal information with companies, organizations, or individuals outside of StreamView except in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your consent</li>
              <li>With domain administrators</li>
              <li>For external processing</li>
              <li>For legal reasons</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">4. Data Security</h2>
            <p>
              We work hard to protect StreamView and our users from unauthorized access to or unauthorized alteration, disclosure, or destruction of information we hold. In particular, we encrypt many of our services using SSL, review our information collection, storage, and processing practices, and restrict access to personal information to StreamView employees, contractors, and agents who need to know that information in order to process it for us.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">5. Your Controls and Choices</h2>
            <p>
              You have choices regarding the information we collect and how it's used. You can access, update, or request deletion of your information at any time. We also provide settings to control how your information is used for advertising and recommendations.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">6. Changes to This Policy</h2>
            <p>
              We may change this privacy policy from time to time. We will not reduce your rights under this privacy policy without your explicit consent. We will post any privacy policy changes on this page and, if the changes are significant, we will provide a more prominent notice.
            </p>
          </section>
          
          <p className="mt-8 text-sm text-zinc-500">
            Last updated: January 1, 2025
          </p>
        </div>
      </div>
    </div>
  );
}