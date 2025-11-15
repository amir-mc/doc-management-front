"use client";

import React from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition duration-200"
        >
          ✕ بستن
        </button>
        
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-800 text-white">
            <h3 className="text-lg font-bold">{title}</h3>
          </div>
          
          <div className="flex justify-center items-center bg-black">
            <img 
              src={imageUrl} 
              alt={title}
              className="max-w-full max-h-96 object-contain"
            />
          </div>
          
          <div className="p-4 bg-gray-100 flex justify-between">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
            >
              بستن
            </button>
            <a
              href={imageUrl}
              download={title}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
            >
              دانلود عکس
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;