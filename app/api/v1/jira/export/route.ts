import { NextRequest, NextResponse } from 'next/server';

/**
 * Jira Export API - v1 Architecture
 * Suit le pattern v1 établi avec config locale
 */

// Configuration Jira - Pattern établi dans l'architecture v1
const JIRA_CONFIG = {
  domain: process.env.JIRA_DOMAIN || "abarouzabarouz.atlassian.net",
  email: process.env.JIRA_EMAIL || "abarouzabarouz@gmail.com",
  token: process.env.JIRA_API_TOKEN || "",
};

// Headers pour authentification Jira
const getJiraHeaders = () => {
  const auth = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.token}`).toString('base64');
  return {
    'Authorization': `Basic ${auth}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

/**
 * API v1 - Export des données Jira
 * POST /api/v1/jira/export
 */

export async function POST(request: NextRequest) {
  try {
    console.log("📊 [v1] Export de données Jira...");
    
    if (!JIRA_CONFIG.token || JIRA_CONFIG.token === "") {
      console.error("❌ [v1] Token Jira manquant - Configuration requise");
      return NextResponse.json({ 
        status: 401,
        message: "Token Jira non configuré",
        data: null,
        type: "ERROR",
        source: 'jira-error'
      }, { status: 401 });
    }

    const body = await request.json();
    const { format, data, filename } = body;
    
    if (!format || !data) {
      return NextResponse.json({ 
        status: 400,
        message: "Format et données requis",
        data: null,
        type: "ERROR",
        source: 'validation-error'
      }, { status: 400 });
    }

    let exportData: string | Buffer;
    let contentType: string;
    let fileExtension: string;

    switch (format.toLowerCase()) {
      case 'csv':
        exportData = convertToCSV(data);
        contentType = 'text/csv';
        fileExtension = 'csv';
        break;
      
      case 'json':
        exportData = JSON.stringify(data, null, 2);
        contentType = 'application/json';
        fileExtension = 'json';
        break;
      
      case 'pdf':
        exportData = generatePDF(data);
        contentType = 'application/pdf';
        fileExtension = 'pdf';
        break;
      
      case 'excel':
        exportData = generateExcel(data);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
        break;
      
      default:
        return NextResponse.json({ 
          status: 400,
          message: "Format non supporté",
          data: null,
          type: "ERROR",
          source: 'validation-error'
        }, { status: 400 });
    }

    // Créer le nom de fichier
    const finalFilename = filename || `jira-export-${new Date().toISOString().split('T')[0]}.${fileExtension}`;

    console.log(`✅ [v1] Export ${format} créé: ${finalFilename}`);

    // Uniformiser le retour: encoder en base64 pour éviter toute corruption binaire via JSON
    const isBuffer = Buffer.isBuffer(exportData);
    const base64Data = isBuffer
      ? (exportData as Buffer).toString('base64')
      : Buffer.from(exportData as string, 'utf-8').toString('base64');

    return NextResponse.json({
      status: 200,
      message: `Export ${format} créé avec succès`,
      data: {
        format: format.toLowerCase(),
        filename: finalFilename,
        contentType,
        // Données encodées en base64 pour tous les formats
        data: base64Data,
        isBase64: true
      },
      type: "EXPORT_CREATED",
      source: 'export'
    });

  } catch (error) {
    console.error("❌ [v1] Erreur lors de l'export:", error);
    
    return NextResponse.json({
      status: 500,
      message: "Erreur lors de l'export",
      data: null,
      type: "ERROR",
      source: 'export-error',
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
}

// Fonction utilitaire pour convertir les données en CSV
function convertToCSV(data: any[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  // Obtenir les en-têtes depuis le premier objet
  const headers = Object.keys(data[0]);
  
  // Créer la ligne d'en-tête
  const csvHeaders = headers.map(header => `"${header}"`).join(',');
  
  // Créer les lignes de données
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Échapper les guillemets et entourer de guillemets si nécessaire
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',')
  );
  
  return [csvHeaders, ...csvRows].join('\n');
}

// Fonction utilitaire pour générer un PDF
function generatePDF(data: any[]): Buffer {
  try {
    // Import dynamique de jsPDF pour éviter les erreurs côté serveur
    const { jsPDF } = require('jspdf');
    
    const doc = new jsPDF();
    
    // Titre
    doc.setFontSize(20);
    doc.text('Rapport Jira', 20, 20);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
    
    // Tableau des données
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      let yPosition = 50;
      
      // En-têtes
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      headers.forEach((header, index) => {
        doc.text(header, 20 + (index * 40), yPosition);
      });
      
      yPosition += 10;
      
      // Données
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      data.forEach((row, rowIndex) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        
        headers.forEach((header, colIndex) => {
          const value = String(row[header] || '');
          doc.text(value.substring(0, 15), 20 + (colIndex * 40), yPosition);
        });
        
        yPosition += 7;
      });
    }
    
    // Retourner un Buffer binaire (pas une data URI) pour éviter la corruption
    const arrayBuffer: ArrayBuffer = doc.output('arraybuffer');
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error('❌ Erreur lors de la génération PDF:', error);
    // Fallback vers CSV si PDF échoue
    const csv = convertToCSV(data);
    return Buffer.from(csv, 'utf-8');
  }
}

// Fonction utilitaire pour générer un fichier Excel
function generateExcel(data: any[]): Buffer {
  try {
    // Import dynamique de xlsx pour éviter les erreurs côté serveur
    const XLSX = require('xlsx');
    
    // Créer un nouveau workbook
    const workbook = XLSX.utils.book_new();
    
    // Convertir les données en worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Ajuster la largeur des colonnes
    const colWidths = [];
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      headers.forEach(header => {
        const maxLength = Math.max(
          header.length,
          ...data.map(row => String(row[header] || '').length)
        );
        colWidths.push({ width: Math.min(maxLength + 2, 50) });
      });
    }
    worksheet['!cols'] = colWidths;
    
    // Ajouter le worksheet au workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Données Jira');
    
    // Générer le buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return buffer;
  } catch (error) {
    console.error('❌ Erreur lors de la génération Excel:', error);
    // Fallback vers CSV si Excel échoue
    const csvData = convertToCSV(data);
    return Buffer.from(csvData, 'utf-8');
  }
}
