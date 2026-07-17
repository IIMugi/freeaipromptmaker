import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export function median(values) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('median requires at least one numeric value');
  }
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function categoryScore(report, key) {
  const value = report.categories?.[key]?.score;
  if (typeof value !== 'number') throw new Error(`Missing Lighthouse category: ${key}`);
  return value * 100;
}

function auditValue(report, key) {
  const value = report.audits?.[key]?.numericValue;
  if (typeof value !== 'number') throw new Error(`Missing Lighthouse audit: ${key}`);
  return value;
}

export function summarizeReports(reports) {
  if (!Array.isArray(reports) || reports.length === 0) {
    throw new Error('At least one Lighthouse report is required');
  }

  return {
    lighthouseVersion: reports[0].lighthouseVersion,
    runs: reports.length,
    performance: Math.round(median(reports.map((report) => categoryScore(report, 'performance')))),
    accessibility: Math.round(median(reports.map((report) => categoryScore(report, 'accessibility')))),
    bestPractices: Math.round(median(reports.map((report) => categoryScore(report, 'best-practices')))),
    seo: Math.round(median(reports.map((report) => categoryScore(report, 'seo')))),
    fcpMs: Math.round(median(reports.map((report) => auditValue(report, 'first-contentful-paint')))),
    lcpMs: Math.round(median(reports.map((report) => auditValue(report, 'largest-contentful-paint')))),
    tbtMs: Math.round(median(reports.map((report) => auditValue(report, 'total-blocking-time')))),
    cls: Number(median(reports.map((report) => auditValue(report, 'cumulative-layout-shift'))).toFixed(4)),
    transferBytes: Math.round(median(reports.map((report) => auditValue(report, 'total-byte-weight')))),
  };
}

function runCli(args) {
  const outputFlag = args.indexOf('--output');
  let outputPath;
  if (outputFlag >= 0) {
    outputPath = args[outputFlag + 1];
    if (!outputPath) throw new Error('--output requires a path');
    args.splice(outputFlag, 2);
  }
  if (args.length === 0) {
    throw new Error('Usage: node scripts/parse_lighthouse.mjs [--output file.json] report-1.json ...');
  }

  const reports = args.map((file) => JSON.parse(fs.readFileSync(file, 'utf8')));
  const rendered = `${JSON.stringify(summarizeReports(reports), null, 2)}\n`;
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(outputPath, rendered);
  }
  process.stdout.write(rendered);
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) {
  runCli(process.argv.slice(2));
}
