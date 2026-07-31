export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-heading font-semibold text-lg mb-3">
              Visuals by Pritam
            </h3>
            <p className="text-sm text-text-secondary">
              A premium creative portfolio showcasing visual work and
              creative projects.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-3 text-text-secondary uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-text-secondary hover:text-text transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/portfolio" className="text-text-secondary hover:text-text transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="/contact" className="text-text-secondary hover:text-text transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-3 text-text-secondary uppercase tracking-wider">
              Connect
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-text-secondary hover:text-text transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-text transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-text transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-divider pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">
            &copy; {new Date().getFullYear()} Visuals by Pritam. All rights reserved.
          </p>
          <p className="text-xs text-text-tertiary">
            Built with React, Tailwind CSS, and Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}