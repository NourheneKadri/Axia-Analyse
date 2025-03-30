using Axia_Analyse.Data.Interface.Entites;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;


namespace Axia_Analyse.Service
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IOptions<CloudinarySettings> cloudinarySettings)
        {
            var account = new Account(
                cloudinarySettings.Value.CloudName,
                cloudinarySettings.Value.ApiKey,
                cloudinarySettings.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File cannot be null or empty");
            }

            var fileName = Path.GetFileName(file.FileName);
            var fileDescription = new FileDescription(fileName, file.OpenReadStream());

            var uploadParams = new ImageUploadParams
            {
                File = fileDescription,
                Folder = "company_logos" // Optional: specify a folder in Cloudinary
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return uploadResult.Url.ToString();  // Return the URL of the uploaded image
            }

            throw new Exception("Error uploading file to Cloudinary");
        }
        public async Task<string> UploadCVAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File cannot be null or empty");
            }

            var fileName = Path.GetFileName(file.FileName);
            var fileDescription = new FileDescription(fileName, file.OpenReadStream());

            var uploadParams = new ImageUploadParams
            {
                File = fileDescription,
                Folder = "CVs" // Optional: specify a folder in Cloudinary
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.StatusCode == System.Net.HttpStatusCode.OK)
            {
                return uploadResult.Url.ToString();  // Return the URL of the uploaded image
            }

            throw new Exception("Error uploading file to Cloudinary");
        }
    }
}
