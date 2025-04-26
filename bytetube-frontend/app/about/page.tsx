export default function About() {
  return (
    <div className="min-h-screen bg-zinc-900 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          About ByteTube
        </h1>
        
        <div className="space-y-8 text-zinc-300">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">Our Vision</h2>
            <p>
              ByteTube was created with a simple mission: to provide a clean, intuitive platform for video streaming 
              that puts content and community at the center of the experience.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">The Platform</h2>
            <p className="mb-4">
              Our platform combines high-quality video streaming with live chat, creating a space 
              where viewers can connect while enjoying content. We've designed the interface to be 
              minimal and beautiful, letting the content take center stage while giving you all the 
              controls you need for a perfect viewing experience.
            </p>
            <p>
              All of our features are built with performance and accessibility in mind, ensuring that 
              ByteTube works well for everyone, on any device.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">Our Team</h2>
            <p>
              ByteTube is made by a team of passionate designers and developers who believe in 
              the power of video to connect, educate, and entertain. We're constantly working to 
              improve the platform based on user feedback and emerging technologies.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-4 text-zinc-100">Contact Us</h2>
            <p>
              We'd love to hear from you! Whether you have feedback, questions, or just want to say hello, 
              you can reach us at <a href="mailto:hello@bytetube.example" className="text-purple-400 hover:text-purple-300">
              hello@bytetube.example</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}