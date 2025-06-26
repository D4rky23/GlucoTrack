import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

const Header = ({ children }) => {
  return <div className="px-6 pt-6 pb-2">{children}</div>;
};

const Title = ({ children }) => {
  return <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{children}</h2>;
};

const Content = ({ children }) => {
  return <div className="px-6 pb-6">{children}</div>;
};

Card.Header = Header;
Card.Title = Title;
Card.Content = Content;

export default Card;
