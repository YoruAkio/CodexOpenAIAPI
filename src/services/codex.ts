import { spawn } from "child_process";
import { env } from "../config/env";

export async function runCodex(prompt: string, model: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const args = [
      "--ask-for-approval",
      "never",
      "exec",
      "-c",
      `model_reasoning_effort=\"${env.codexReasoningEffort}\"`,
      "--sandbox",
      env.codexSandbox,
      "--skip-git-repo-check",
      "--model",
      model,
      prompt,
    ];

    const child = spawn(env.codexBin, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, env.codexTimeoutMs);

    child.stdout.on("data", (chunk: Buffer | string) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk: Buffer | string) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (code) => {
      clearTimeout(timer);

      if (timedOut) {
        reject(new Error(`codex execution timed out after ${env.codexTimeoutMs}ms`));
        return;
      }

      if (code !== 0) {
        reject(new Error((stderr || stdout).trim() || `codex exited with code ${code}`));
        return;
      }

      resolve(stdout.trim());
    });
  });
}
