using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Axia_Analyse.Service.Interfaces.Dtos
{
    public class CvInputModel
    {
        public IFormFile CvFile { get; set; }
        public string? CvFileUrl { get; set; }


    }
}
