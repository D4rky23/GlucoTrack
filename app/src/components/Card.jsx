const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 ${className}`} // Added Tailwind classes for basic styling
      {...props}
    >
      {children}
    </div>
  );
};

const Header = ({ children, className = '', ...props }) => {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

const Title = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`} {...props}>
      {children}
    </h3>
  );
};

const Content = ({ children, className = '', ...props }) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Header = Header;
Card.Title = Title;
Card.Content = Content;

export default Card;
