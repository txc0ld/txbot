import { main as indexMain } from "./index.js";
import { main as checkAndReplyMain } from "./check-and-reply.js";

/**
 * Schedules a function to run repeatedly with random intervals
 * @param fn Function to execute
 * @param minMinutes Minimum minutes between executions
 * @param maxMinutes Maximum minutes between executions
 */
function scheduleWithRandomInterval(
  fn: () => Promise<void>,
  minMinutes: number,
  maxMinutes: number,
  name: string
): void {
  const executeAndReschedule = async () => {
    try {
      console.log(`Executing ${name}...`);
      await fn();
      console.log(`Completed ${name}`);
    } catch (error) {
      console.error(`Error in ${name}:`, error);
    }

    // Calculate random interval for next execution
    const minMs = minMinutes * 60 * 1000;
    const maxMs = maxMinutes * 60 * 1000;
    const nextInterval =
      Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

    const nextMinutes = (nextInterval / (60 * 1000)).toFixed(2);
    console.log(`Next ${name} scheduled in ${nextMinutes} minutes`);

    setTimeout(executeAndReschedule, nextInterval);
  };

  // Start the first execution
  executeAndReschedule();
}

// Start the check replies flow immediately
console.log("Starting check replies flow scheduler...");
scheduleWithRandomInterval(checkAndReplyMain, 1, 15, "check replies flow"); // 1 to 15 minutes

// Start the main trading flow after a 45-second delay
console.log("Will start main trading flow scheduler in 45 seconds...");
setTimeout(() => {
  console.log("Starting main trading flow scheduler...");
  scheduleWithRandomInterval(indexMain, 15, 20, "main trading flow"); // 15 to 20 minutes
}, 45000); // 45 seconds

console.log(
  "Scheduler started. Both processes will run on randomized intervals with staggered start."
);
