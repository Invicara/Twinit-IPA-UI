// Animation logic for long text items
export const startTextAnimation = (textElement: HTMLElement) => {
  const scrollDistance = textElement.scrollWidth - textElement.clientWidth;
  if (scrollDistance > 0) {
    const textContent = textElement.textContent || '';
    const charCount = textContent.length;
    const charsPerSecond = 6;
    const duration = Math.max(3, charCount / charsPerSecond);
    
    textElement.style.animationDelay = '0s';
    textElement.style.animation = `scrollText${scrollDistance} ${duration}s linear infinite`;
    
    const animationName = `scrollText${scrollDistance}`;
    if (!document.querySelector(`style[data-animation="${animationName}"]`)) {
      const style = document.createElement('style');
      style.setAttribute('data-animation', animationName);
      style.textContent = `
        @keyframes ${animationName} {
          0% { transform: translateX(0); animation-delay: 0s; }
          45% { transform: translateX(-${scrollDistance}px); }
          55% { transform: translateX(-${scrollDistance}px); }
          100% { transform: translateX(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }
};

export const stopTextAnimation = (textElement: HTMLElement) => {
  textElement.style.animation = 'none';
  textElement.style.transform = 'translateX(0)';
};

export const truncateText = (text: string, maxLength: number = 10) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '..';
};

