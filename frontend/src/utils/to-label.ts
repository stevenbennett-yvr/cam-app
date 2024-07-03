import { titleCase } from "title-case";

export function toLabel(text?: string | null) {
  if (!text) return "";

  const REMOVAL_CHANGES = [
    "attribute_physical_",
    "attribute_social_",
    "attribute_mental_",
    "skill_physical_",
    "skill_social_",
    "skill_mental_",
    "discipline_inclan_",
    "discipline_"
  ];

  let label = text.trim().toLowerCase();
  for (const value of REMOVAL_CHANGES) {
    label = label.replace(value, "");
  }
  label = label.replace(/_/g, " ");
  label = titleCase(label);
  return label.trim();
}
