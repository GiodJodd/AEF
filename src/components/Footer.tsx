export default function Footer({ minimal = false }: { minimal?: boolean }) {
  if (minimal) {
    return (
      <footer className="fixed bottom-0 left-0 right-0 z-40 px-6 md:px-12 py-4 flex justify-between items-center text-xs tracking-widest uppercase text-[#444]">
        <span>AEF &middot; Rome &middot; London</span>
        <span>&copy; 2026</span>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/5 px-6 md:px-12 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <p className="text-xl tracking-[0.3em] font-light uppercase mb-2">AEF</p>
          <p className="text-sm text-[#666]">Rome &middot; London</p>
        </div>
        <div className="flex gap-8 text-sm text-[#666]">
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">Vimeo</a>
          <a href="#" className="hover:text-white transition-colors">Email</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/5 text-xs text-[#444] tracking-widest uppercase">
        &copy; 2026 AEF. All rights reserved.
      </div>
    </footer>
  );
}
