import { ExecutionEnvironment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/extract-text-from-element";
import * as cheerio from "cheerio";

export async function ExtractTextFromElementExecutor(
  environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>,
): Promise<boolean> {
  try {
    const selector = environment.getInput("Selector");
    if (!selector) {
      console.error("Selector is required");
      return false;
    }

    const html = environment.getInput("Html");
    if (!html) {
      console.error("Html is required");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.error(`Selector "${selector}" not found in HTML`);
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      console.error(`No text found in element "${selector}"`);
      return false;
    }

    environment.setOutput("Extracted text", extractedText);

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
