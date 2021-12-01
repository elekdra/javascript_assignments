using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Assignment_3.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;

namespace Assignment_3.Controllers
{
 [ApiController]
 [Route("api/[controller]")]
 public class FileServiceController : ControllerBase
 {
  IWebHostEnvironment environment;
  public FileServiceController(IWebHostEnvironment environment)
  {
   this.environment = environment;
  }

  [HttpGet]
  [Route("imagenames")]
  public IList<string> GetImageNames()
  {

   string webRootPath = environment.WebRootPath;
   string imagesPath = Path.Combine(webRootPath, "images");
   return new List<string>(Directory.GetFiles(imagesPath).Select(path => Path.GetFileName(path)));
  }

  [HttpPut]
  [Route("filesave")]
  public IActionResult PutFileNames([FromBody] FileModel model)
  {
   Console.WriteLine("errrorrr testet");
   string webRootPath = environment.WebRootPath;
   string filesPath = Path.Combine(webRootPath, "images");
   string fileNamesave = model.FileName;
   string path = filesPath + "\\" + fileNamesave;
   Console.WriteLine(path);
   Console.WriteLine("errrorrr testet");
   Console.WriteLine(model.FileName);
   Console.WriteLine(model.FileContent);
   //  DirectoryInfo info = new DirectoryInfo(filesPath);
   //     WindowsIdentity self = System.Security.Principal.WindowsIdentity.GetCurrent();
   //     DirectorySecurity ds = info.GetAccessControl();
   //     ds.AddAccessRule(new FileSystemAccessRule(self.Name, 
   //     FileSystemRights.FullControl,
   //     InheritanceFlags.ObjectInherit |
   //     InheritanceFlags.ContainerInherit,
   //     PropagationFlags.None,
   //     AccessControlType.Allow));
   //     info.SetAccessControl(ds);

   //  System.IO.File.SetAttributes(path, FileAttributes.Normal);
   //    if (System.IO.File.Exists(path)) {  
   //        Console.WriteLine("delete");
   //    System.IO.File.Delete(path);  
   //   }  

   using (FileStream fs = System.IO.File.Create(path))
   {

    Console.WriteLine("cretre");
    Byte[] content = new UTF8Encoding(true).GetBytes(model.FileContent);
    fs.Write(content, 0, content.Length);
   }
   using (StreamReader sr = System.IO.File.OpenText(path))
   {
    string s = "";
    while ((s = sr.ReadLine()) != null)
    {
     Console.WriteLine(s);
    }
   }
   return Ok();

  }
 }
}