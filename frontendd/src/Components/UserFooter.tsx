import React from 'react';
import { Stethoscope, Mail, Phone, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-teal-700 text-white py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="h-6 w-6" />
              <span className="font-bold text-xl">Doctalk</span>
            </div>
            <p className="text-teal-100 mb-6">
              Expert Care, Anytime, Anywhere
            </p>
            <p className="text-sm text-teal-100">
              Connect with the top doctors across various specializations and receive quality consultation and care from the comfort of your home.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Find Doctors</a></li>
              <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Specializations</a></li>
              <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Book Appointment</a></li>
              <li><a href="#" className="text-teal-100 hover:text-white transition-colors">Health Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-teal-300" />
                <a href="mailto:contact@medicare.com" className="text-teal-100 hover:text-white transition-colors">doctalk@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-teal-300" />
                <a href="tel:+11234567890" className="text-teal-100 hover:text-white transition-colors">+1 (123) 456-7890</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-teal-600 h-10 w-10 rounded-full flex items-center justify-center hover:bg-teal-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-teal-600 h-10 w-10 rounded-full flex items-center justify-center hover:bg-teal-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-teal-600 h-10 w-10 rounded-full flex items-center justify-center hover:bg-teal-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-teal-600 text-center text-sm text-teal-200">
          <p>© 2025 Doctalk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;