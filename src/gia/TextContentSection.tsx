import React from 'react';

interface TextSectionProps {
  title: string;
  content: string;
  extraContent?: React.ReactNode;
}

const TextContentSection: React.FC<TextSectionProps> = ({ title, content, extraContent }) => {
  // Convert newlines in content to paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className="section-title px-5 mb-3">
      {title && (
        <h4 className="position-relative d-inline-block text-dark-blue text-uppercase mt-3 display-7 mb-3">
          {title}
        </h4>
      )}
      {paragraphs.map((paragraph, index) => (
        <p key={index} style={{ fontSize: 18 }} className={index < paragraphs.length - 1 ? "mb-3" : ""}>
          {paragraph.trim()}
        </p>
      ))}
      {extraContent}
    </div>
  );
};

export default TextContentSection;