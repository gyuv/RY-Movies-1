export default function Footer() {
  return (
    <footer className="w-full py-12 border-t border-white/10 bg-[#0a0b10]/50 backdrop-blur-lg">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Cinereel</h3>
            <p className="text-white/50 text-sm">
              Your ultimate destination for discovering and streaming movies from around the world.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Browse</h4>
            <ul className="space-y-2 text-white/50 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Popular</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Top Rated</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Upcoming</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Now Playing</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Genres</h4>
            <ul className="space-y-2 text-white/50 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Action</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Comedy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Drama</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Horror</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2 text-white/50 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-white/30 text-sm">
          <p>&copy; {new Date().getFullYear()} Cinereel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
