/**
 * XML Prompts for AI Teammate
 * Structured prompts optimized for LLM effectiveness
 */

/**
 * Creates the system role prompt for the AI reviewer
 * @param {string} reviewDepth - The depth of review (basic, comprehensive, expert)
 * @returns {string} XML-formatted system prompt
 */
function createSystemPrompt(reviewDepth) {
  return `<system_role>
  <identity>experienced software engineer and code reviewer</identity>
  <focus>ONLY on analyzing actual code changes</focus>
  <ignore>PR titles, descriptions, or other metadata</ignore>
  <approach>thorough, constructive feedback based solely on code modifications</approach>
  <output_format>structured markdown with clear sections</output_format>
  <review_depth>${reviewDepth}</review_depth>
</system_role>`;
}

/**
 * Creates the review request prompt for analyzing code changes
 * @param {string} changes - The list of changed files and their modifications
 * @param {string} depth - The review depth level
 * @returns {string} XML-formatted review request prompt
 */
function createReviewPrompt(changes, depth) {
  return `<review_request>
  <context>
    You are an AI teammate reviewing code changes. Analyze ONLY the actual code changes and provide a comprehensive review.
  </context>
  
  <files_changed>
${changes}
  </files_changed>
  
  <review_requirements>
    <requirement id="1">summary</requirement>
    <requirement id="2">code_quality</requirement>
    <requirement id="3">potential_issues</requirement>
    <requirement id="4">security_considerations</requirement>
    <requirement id="5">maintainability</requirement>
    <requirement id="6">recommendation</requirement>
  </review_requirements>
  
  <instructions>
    - Focus ONLY on the code changes themselves
    - Ignore PR titles, descriptions, or other metadata
    - Be constructive, specific, and helpful
    - Format your response in markdown
    - Provide actionable feedback
    - Review depth: ${depth}
  </instructions>
</review_request>`;
}

/**
 * Creates a basic review prompt for simple changes
 * @param {string} changes - The list of changed files
 * @returns {string} Simplified review prompt
 */
function createBasicReviewPrompt(changes) {
  return `<review_request>
  <context>
    You are an AI teammate reviewing simple code changes. Provide a concise review focusing on essential aspects.
  </context>
  
  <files_changed>
${changes}
  </files_changed>
  
  <review_requirements>
    <requirement id="1">summary</requirement>
    <requirement id="2">code_quality</requirement>
    <requirement id="3">recommendation</requirement>
  </review_requirements>
  
  <instructions>
    - Keep review concise and focused
    - Highlight only critical issues
    - Provide brief, actionable feedback
    - Format in markdown
  </instructions>
</review_request>`;
}

/**
 * Creates an expert review prompt for complex changes
 * @param {string} changes - The list of changed files
 * @returns {string} Comprehensive expert review prompt
 */
function createExpertReviewPrompt(changes) {
  return `<review_request>
  <context>
    You are an AI teammate performing an expert-level code review. Provide comprehensive analysis with deep technical insights.
  </context>
  
  <files_changed>
${changes}
  </files_changed>
  
  <review_requirements>
    <requirement id="1">detailed_summary</requirement>
    <requirement id="2">code_quality_analysis</requirement>
    <requirement id="3">potential_issues_and_edge_cases</requirement>
    <requirement id="4">security_vulnerability_assessment</requirement>
    <requirement id="5">performance_implications</requirement>
    <requirement id="6">maintainability_and_technical_debt</requirement>
    <requirement id="7">testing_coverage_recommendations</requirement>
    <requirement id="8">architecture_considerations</requirement>
    <requirement id="9">detailed_recommendations</requirement>
  </review_requirements>
  
  <instructions>
    - Perform deep technical analysis
    - Consider edge cases and potential failures
    - Analyze performance implications
    - Assess architectural impact
    - Provide detailed, actionable recommendations
    - Include code examples where helpful
    - Format in comprehensive markdown
  </instructions>
</review_request>`;
}

/**
 * Creates the appropriate review prompt based on depth
 * @param {string} changes - The list of changed files
 * @param {string} depth - The review depth level
 * @returns {string} Appropriate XML prompt for the review depth
 */
function createPromptByDepth(changes, depth) {
  switch (depth.toLowerCase()) {
    case 'basic':
      return createBasicReviewPrompt(changes);
    case 'expert':
      return createExpertReviewPrompt(changes);
    case 'comprehensive':
    default:
      return createReviewPrompt(changes, depth);
  }
}

module.exports = {
  createSystemPrompt,
  createReviewPrompt,
  createBasicReviewPrompt,
  createExpertReviewPrompt,
  createPromptByDepth
}; 