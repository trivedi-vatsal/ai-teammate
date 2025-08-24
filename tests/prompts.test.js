const {
  createSystemPrompt,
  createOverviewAndChangesPrompt,
  createPromptByDepth,
  createBasicReviewPrompt,
  createExpertReviewPrompt,
} = require("../src/prompts");

describe("Prompts Module", () => {
  const mockChanges = `
test.js (5 changes)
src/index.js (10 changes)
README.md (3 changes)
  `.trim();

  describe("createSystemPrompt", () => {
    it("should create system prompt with specified review depth", () => {
      const prompt = createSystemPrompt("comprehensive");
      expect(prompt).toContain("<system_role>");
      expect(prompt).toContain("<review_depth>comprehensive</review_depth>");
      expect(prompt).toContain("Expert AI Code Reviewer - Your AI Teammate");
    });
  });

  describe("createOverviewAndChangesPrompt", () => {
    it("should create overview and changes prompt with required elements", () => {
      const prompt = createOverviewAndChangesPrompt(mockChanges);
      expect(prompt).toContain("<overview_and_changes_request>");
      expect(prompt).toContain("<files_changed>");
      expect(prompt).toContain(mockChanges);
      expect(prompt).toContain("🤖 AI Teammate - Change Overview");
      expect(prompt).toContain("## Overview");
      expect(prompt).toContain("## Changes");
      expect(prompt).toContain("separate detailed review comment");
    });

    it("should focus only on overview and changes sections", () => {
      const prompt = createOverviewAndChangesPrompt(mockChanges);
      expect(prompt).not.toContain("Strengths");
      expect(prompt).not.toContain("Suggestions for Improvement");
      expect(prompt).not.toContain("Security Considerations");
    });
  });

  describe("createPromptByDepth", () => {
    it("should return basic prompt for basic depth", () => {
      const prompt = createPromptByDepth(mockChanges, "basic");
      expect(prompt).toContain("<review_request>");
      expect(prompt).toContain("focused, concise code review");
      expect(prompt).toContain(mockChanges);
    });

    it("should return expert prompt for expert depth", () => {
      const prompt = createPromptByDepth(mockChanges, "expert");
      expect(prompt).toContain("<review_request>");
      expect(prompt).toContain("expert-level, comprehensive code review");
      expect(prompt).toContain(
        "architectural insights and detailed recommendations"
      );
    });

    it("should return comprehensive prompt for default/unknown depth", () => {
      const prompt = createPromptByDepth(mockChanges, "comprehensive");
      expect(prompt).toContain("<review_request>");
      expect(prompt).toContain("comprehensive, helpful feedback");
      expect(prompt).toContain("separate detailed review comment");

      const unknownPrompt = createPromptByDepth(mockChanges, "unknown");
      expect(unknownPrompt).toContain("<review_request>");
      expect(unknownPrompt).toContain("separate detailed review comment");
    });
  });

  describe("createBasicReviewPrompt", () => {
    it("should create basic review prompt with required elements", () => {
      const prompt = createBasicReviewPrompt(mockChanges);
      expect(prompt).toContain("<review_request>");
      expect(prompt).toContain("<files_changed>");
      expect(prompt).toContain(mockChanges);
      expect(prompt).toContain("focused, concise code review");
      expect(prompt).toContain("separate detailed review comment");
    });

    it("should focus only on review sections without overview and changes", () => {
      const prompt = createBasicReviewPrompt(mockChanges);
      expect(prompt).not.toContain("## Overview");
      expect(prompt).not.toContain("## Changes");
      expect(prompt).toContain("🎯 Key Points");
    });
  });

  describe("createExpertReviewPrompt", () => {
    it("should create expert review prompt with comprehensive requirements", () => {
      const prompt = createExpertReviewPrompt(mockChanges);
      expect(prompt).toContain("<review_request>");
      expect(prompt).toContain("<files_changed>");
      expect(prompt).toContain(mockChanges);
      expect(prompt).toContain("Security Assessment");
      expect(prompt).toContain("Performance Analysis");
      expect(prompt).toContain("separate detailed review comment");
    });

    it("should focus only on expert review sections without overview and changes", () => {
      const prompt = createExpertReviewPrompt(mockChanges);
      expect(prompt).not.toContain("## Overview");
      expect(prompt).not.toContain("## Changes");
      expect(prompt).toContain("Architectural Impact");
      expect(prompt).toContain("Expert Recommendations");
    });
  });
});
