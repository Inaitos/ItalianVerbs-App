using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Verbs.Data;
using Newtonsoft.Json;
namespace Verbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ItalianVerbsController : ControllerBase
{
    private Definition[] _definitions;
    
    public ItalianVerbsController()
    {
        _definitions = System.IO.File
            .ReadLines(Path.Combine("data", "italian-verbs.csv"))
            .Select(l=> $@".\data\content\{l.First()}\{l}.json")
            .Where(System.IO.File.Exists)
            .Select(fileName => ReadFromFile(fileName))
            .Where(d=> d.Conjugations != null)
            .ToArray();
    }
    
    [HttpGet]
    public DtoWord[] Get()
    {
        
        
        var dtow = _definitions
            .Select(NewWord)
            .ToArray();
        return dtow;

    }

    private DtoWord NewWord(Definition def, int i)
    {
        var cDct = def
            .Conjugations
            .Where(c => c.Group == "indicative/present")
            .ToDictionary(c => c.Form, c=> c.Value)
            ;
        return new DtoWord(def.Word, i + 1){Conjugations = cDct};
    }

    private Definition ReadFromFile(string fileName)
    {
        var fileData = System.IO.File.ReadAllText(fileName);
        var p = JsonConvert.DeserializeObject<Definition>(fileData);
        return p;
    }
}
