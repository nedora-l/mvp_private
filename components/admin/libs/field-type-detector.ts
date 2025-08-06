import {
  FileText,
  Hash,
  Calendar,
  Settings,
  Link,
  Database,
  Mail,
  Phone,
  File, // More generic file icon
  Calculator, // For formulas
  Sigma, // For roll-up summaries (sum)
  ListOrdered, // For auto-number
  Clock, // For time
  CheckSquare, // For checkbox and picklists
  Ruler, // For 'unite' as a general measure/unit icon
  Type, // For rich text
  UsersRound // For relation types
} from "lucide-react";

export const getFieldTypeIconGlobal = (fieldTypeCode: string) => {
  const lowerFieldTypeCode = fieldTypeCode?.toLowerCase() || "";

  switch (lowerFieldTypeCode) {
    // Text-based types
    case "texte":
      return FileText;
    case "e_mail":
      return Mail;
    case "telephone":
      return Phone;
    case "zone_de_texte":
      return FileText; // Or consider 'AlignLeft' or 'Text' if available and distinct
    case "zone_de_texte_enrichi": // HTML content
      return Type; // Icon for typography/rich text
    case "formule": // Formula result is often text but can be number/date
      return Calculator; // Or FunctionSquare
    case "fichier": // Generic file type
      return File; // More generic than FileText, or Paperclip for attachments

    // Number-based types
    case "numero":
      return Hash;
    case "unite": // e.g., EUR, kg, m2
      return Ruler; // General icon for units/measurements
    case "recapitulatif_de_cumul": // Roll-up summary, typically numeric
      return Sigma; // Represents sum/aggregation
    case "numero_automatique": // Auto-number field
      return ListOrdered; // Represents a sequence

    // Date/Time types
    case "date":
      return Calendar;
    case "heure":
      return Clock;
    case "date_heure":
      return Calendar; // Calendar can represent date/time, or use CalendarClock if available

    // Selection/Choice types
    case "liste_de_selection": // Picklist
    case "liste_de_selection_selection_multiple": // Multi-select picklist
      return CheckSquare; // Or ListChecks
    case "case_a_cocher": // Checkbox
      return CheckSquare;

    // Link/Relation types
    case "relation_de_recherche": // Lookup relationship
    case "relation_principal_details": // Master-detail relationship
    case "relation_parent_details": // Parent-detail relationship
      return UsersRound; // Or Link, Network, GitMerge depending on nuance
    case "liens_url": // URL type
      return Link; // Or ExternalLink

    // Default icon for any other types
    default:
      return Database;
  }
};
