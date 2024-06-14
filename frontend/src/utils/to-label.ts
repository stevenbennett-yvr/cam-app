import { titleCase } from 'title-case'

export function toLabel(text?: string| null) {
    if (!text) return '';
    let label = text.trim().toLowerCase()
    label = label.replace(/_/g, ' ');
    label = titleCase(label);
    
    return label.trim()
}