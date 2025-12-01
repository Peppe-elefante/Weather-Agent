import '@testing-library/jest-dom';

// Mock scrollIntoView which is not implemented in jsdom
HTMLElement.prototype.scrollIntoView = function() {};
