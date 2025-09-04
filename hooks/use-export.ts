import { useIntelligentNotifications } from './use-intelligent-notifications';

/**
 * Hook personnalisé pour l'export standardisé
 * Respecte le DYNAMISME GLOBAL du projet
 */
export const useExport = () => {
  const { showJiraError, showJiraSuccess, showInfo } = useIntelligentNotifications();

  /**
   * Fonction d'export standardisée et réutilisable
   * @param format - Format d'export (CSV, JSON, PDF, Excel)
   * @param data - Données à exporter
   * @param filename - Nom du fichier
   * @param source - Source de l'export (pour le nommage)
   */
  const handleExport = async (
    format: string, 
    data: any[], 
    filename: string, 
    source: string = 'export'
  ) => {
    if (!data || data.length === 0) {
      showInfo({
        title: "📊 Export",
        message: "Aucune donnée à exporter",
        type: "info"
      });
      return;
    }

    try {
      console.log(`📊 [${source}] Export ${format} de ${data.length} éléments...`);

      const response = await fetch('/api/v1/jira/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format: format.toLowerCase(),
          data,
          filename: `${source}-${format.toLowerCase()}-${data.length}-elements-${new Date().toISOString().split('T')[0]}`
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'export');
      }

      const result = await response.json();

      // Gestion unifiée: l'API renvoie désormais les données encodées en base64
      if (result?.data?.data && result?.data?.contentType && result?.data?.filename) {
        const { data: base64, contentType, filename } = result.data;
        // Convertir le base64 en Blob dans le navigateur
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: contentType });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        showJiraSuccess({
          message: `Export ${format} de ${data.length} éléments téléchargé avec succès !`
        });
      } else {
        throw new Error('Données d\'export invalides');
      }
      
    } catch (error) {
      console.error(`❌ [${source}] Erreur lors de l'export:`, error);
      showJiraError({
        message: "Erreur lors de l'export",
        solution: "Vérifiez que le format est supporté et réessayez",
        error: error instanceof Error ? error.message : "Erreur inconnue",
        source: `${source}-export-error`
      });
    }
  };

  return { handleExport };
};
