import { loadApp } from '../lib/app.mjs';
import { requireSlug } from '../lib/args.mjs';
import { humanBytes } from '../lib/files.mjs';
import { validateApp } from '../lib/validate.mjs';

export const runValidate = async (app, options) => {
  const { errors, warnings, info } = await validateApp(app, options);
  for (const warning of warnings) console.warn(`warning: ${warning}`);
  for (const error of errors) console.error(`error: ${error}`);
  console.log(`validate ${app.slug}: ${info.files} files, ${humanBytes(info.bytes)} exported, published ${humanBytes(info.published ?? 0)}, all aso ${humanBytes(info.all ?? 0)}, ${errors.length} errors`);
  if (errors.length > 0) throw new Error(`validation failed with ${errors.length} errors`);
  return info;
};

if (import.meta.main) {
  const { slug, flags } = requireSlug();
  try {
    await runValidate(loadApp(slug), { zip: !flags['no-zip'], boxes: !flags['no-boxes'] });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
