const { chromium } = require("playwright");

(async () => {
  // Launch a new browser instance
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to Stack Overflow's questions page 
  console.log("Navigating to Stack Overflow...");
  await page.goto("https://stackoverflow.com/questions", {
    waitUntil: "domcontentloaded", 
    timeout: 120000, 
  });

  // Apply Filters:
  console.log("Apply Filters:")
  // Sort the questions by "Newest" using the sort options.
  await page.locator('[data-text="Newest"]').click();
  // Filter the questions to only include those tagged with "javascript".
  await page.locator('.svg-icon,.conFilter').nth(6).click()
  await page.locator('.s-input').last().fill('javascript')
  await page.getByRole('button', { name: 'Apply Filter' }).click();

 // Extract data for the first 100 questions
 const extractedQuestions = await webPage.$$eval('.question-summary', (items) => {
  return items.slice(0, 100).map(item => {
  const questionTitle = item.querySelector('.question-hyperlink').innerText;
  const voteCount = item.querySelector('.vote-count-post').innerText;
  const questionTimestamp = item.querySelector('.relativetime').getAttribute('title');
  return { questionTitle, voteCount, questionTimestamp };
  });
});

 // Validate extracted data
 console.log("Validating data...");
 let isValid = true;

for (const question of extractedQuestions) {
  // Check if the question includes "javascript" tag
  const includesJavaScriptTag = await webPage.evaluate((title) => {
    const tags = Array.from(document.querySelectorAll('.tags .post-tag'));
    return tags.some(tag => tag.innerText.toLowerCase() === 'javascript');
  }, question.questionTitle);

  if (!includesJavaScriptTag) {
    console.error(`Question "${question.questionTitle}" does not have the "javascript" tag.`);
    isValid = false;
  }
}

// Check if questions are sorted from newest to oldest based on the timestamp
const questionTimestamps = extractedQuestions.map(q => new Date(q.questionTimestamp));
const sortedTimestamps = [...questionTimestamps].sort((a, b) => b - a);

if (JSON.stringify(questionTimestamps) !== JSON.stringify(sortedTimestamps)) {
  console.error("Questions are not sorted from newest to oldest.");
  isValid = false;
}

// Log extracted data
console.log("Extracted Questions Data:", extractedQuestions);

// Final validation result
if (isValid) {
  console.log("All validations passed successfully.");
} else {
  console.log("Some validations failed.");
}

  // Close the browser
  await browser.close();
})();
