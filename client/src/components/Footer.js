const Footer = () => {
    return (
      <footer className="bg-gray-100 text-black dark:bg-zinc-900 dark:text-white py-6 mt-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} ContestTracker</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Contact</a>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;