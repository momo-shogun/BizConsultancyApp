import type { SettingsSectionConfig } from './helpSettings.types';

export function filterHelpSettingsSections(
  sections: SettingsSectionConfig[],
  hiddenRowIds: ReadonlySet<string>,
): SettingsSectionConfig[] {
  return sections
    .map((section) => ({
      ...section,
      rows: section.rows.filter((row) => !hiddenRowIds.has(row.id)),
    }))
    .filter((section) => section.rows.length > 0);
}
