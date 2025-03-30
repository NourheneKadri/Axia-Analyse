using System;
using System.Text;
using UglyToad.PdfPig;

public class PdfService
{
    public async Task<string> ExtractTextFromPdf(string filePath)
    {
        StringBuilder text = new StringBuilder();

        // Vérifier si le fichier est une URL et le télécharger
        if (filePath.StartsWith("http", StringComparison.OrdinalIgnoreCase))
        {
            using (HttpClient client = new HttpClient())
            {
                string localPath = Path.Combine(Path.GetTempPath(), "cv_temp.pdf");
                byte[] fileBytes = await client.GetByteArrayAsync(filePath);
                await File.WriteAllBytesAsync(localPath, fileBytes);
                filePath = localPath;
            }
        }

        // Vérifier si le fichier existe localement
        if (!File.Exists(filePath))
        {
            throw new FileNotFoundException($"Le fichier PDF n'existe pas : {filePath}");
        }

        // Extraction du texte
        using (PdfDocument document = PdfDocument.Open(filePath))
        {
            foreach (var page in document.GetPages())
            {
                text.AppendLine(page.Text);
            }
        }

        return text.ToString();
    }

}

