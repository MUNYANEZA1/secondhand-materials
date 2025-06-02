import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">INES-Market</h3>
            <p className="text-gray-300">
              A platform for students and staff at INES-Ruhengeri to buy and sell second-hand items.
              Promoting sustainability and circular economy within the campus.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/items/search?category=books" className="text-gray-300 hover:text-white">Books</a></li>
              <li><a href="/items/search?category=electronics" className="text-gray-300 hover:text-white">Electronics</a></li>
              <li><a href="/items/search?category=furniture" className="text-gray-300 hover:text-white">Furniture</a></li>
              <li><a href="/items/search?category=clothing" className="text-gray-300 hover:text-white">Clothing</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-300">INES-Ruhengeri</p>
            <p className="text-gray-300">Musanze, Rwanda</p>
            <p className="text-gray-300">Email: info@ines.ac.rw</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} INES-Market. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
