export default function Footer() {
  return (
    <footer className="py-12 bg-white border-t border-gray-100 text-center">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xl font-bold text-gray-900">Sublime —</span>
          <span className="text-xl font-bold text-gray-900">Commerce infrastructure for creators</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-500 bg-gray-100 py-3 px-8 rounded-full inline-flex">
          <a href="#" className="hover:text-gray-900">About</a>
          <a href="#" className="hover:text-gray-900">Features</a>
          <a href="#" className="hover:text-gray-900">Pricing</a>
          <a href="#" className="hover:text-gray-900">Blog</a>
          <a href="#" className="hover:text-gray-900">Support</a>
          <a href="#" className="hover:text-gray-900">Terms</a>
          <a href="#" className="hover:text-gray-900">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
