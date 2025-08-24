const { 
  createSystemPrompt, 
  createPromptByDepth,
  createBasicReviewPrompt,
  createExpertReviewPrompt 
} = require('../src/prompts');

describe('Prompts Module', () => {
  const mockChanges = `
test.js (5 changes)
src/index.js (10 changes)
README.md (3 changes)
  `.trim();

  describe('createSystemPrompt', () => {
    it('should create system prompt with specified review depth', () => {
      const prompt = createSystemPrompt('comprehensive');
      expect(prompt).toContain('<system_role>');
      expect(prompt).toContain('<review_depth>comprehensive</review_depth>');
      expect(prompt).toContain('experienced software engineer');
    });
  });

  describe('createPromptByDepth', () => {
    it('should return basic prompt for basic depth', () => {
      const prompt = createPromptByDepth(mockChanges, 'basic');
      expect(prompt).toContain('<review_request>');
      expect(prompt).toContain('concise review');
      expect(prompt).toContain(mockChanges);
    });

    it('should return expert prompt for expert depth', () => {
      const prompt = createPromptByDepth(mockChanges, 'expert');
      expect(prompt).toContain('<review_request>');
      expect(prompt).toContain('expert-level code review');
      expect(prompt).toContain('deep technical insights');
    });

    it('should return comprehensive prompt for default/unknown depth', () => {
      const prompt = createPromptByDepth(mockChanges, 'comprehensive');
      expect(prompt).toContain('<review_request>');
      expect(prompt).toContain('comprehensive review');
      
      const unknownPrompt = createPromptByDepth(mockChanges, 'unknown');
      expect(unknownPrompt).toContain('<review_request>');
    });
  });

  describe('createBasicReviewPrompt', () => {
    it('should create basic review prompt with required elements', () => {
      const prompt = createBasicReviewPrompt(mockChanges);
      expect(prompt).toContain('<review_request>');
      expect(prompt).toContain('<files_changed>');
      expect(prompt).toContain(mockChanges);
      expect(prompt).toContain('concise and focused');
    });
  });

  describe('createExpertReviewPrompt', () => {
    it('should create expert review prompt with comprehensive requirements', () => {
      const prompt = createExpertReviewPrompt(mockChanges);
      expect(prompt).toContain('<review_request>');
      expect(prompt).toContain('<files_changed>');
      expect(prompt).toContain(mockChanges);
      expect(prompt).toContain('security_vulnerability_assessment');
      expect(prompt).toContain('performance_implications');
    });
  });
});
