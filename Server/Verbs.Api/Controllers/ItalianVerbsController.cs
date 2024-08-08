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
    private Dictionary<string, Definition> _dictionary;
    
    public ItalianVerbsController()
    {
        _definitions = System.IO.File
            .ReadLines(Path.Combine("data", "italian-verbs.csv"))
            .Select(l=> $@".\data\content\{l.First()}\{l}.json")
            .Where(System.IO.File.Exists)
            .Select(fileName => ReadFromFile(fileName))
            .Where(d=> d.Conjugations != null)
            .DistinctBy(d=> d.Word)
            .ToArray();

        _dictionary = _definitions.ToDictionary(r=> r.Word, r=> r);
    }

    [HttpGet]
    public string[] Get()
    {
        return _definitions.Select(l => l.Word).ToArray();
    }

    [HttpGet("words/{word}")]
    public ActionResult<Definition> GetWord(string word)
    {
        word = word.ToLower();
        return _dictionary[word] == null? NotFound(): _dictionary[word];
    }

    [HttpGet("words/{word}/conjugation")]
    public ActionResult<Conjugation[]> GetConj(string word)
    {
        word = word.ToLower();
        return _dictionary[word] == null? NotFound(): _dictionary[word].Conjugations.Where(r => r.Group == "indicative/present").ToArray();
    }

    [HttpGet("words/{word}/definition")]
    public ActionResult<string[]> GetDef(string word)
    {
        word = word.ToLower();
        return _dictionary[word] == null? NotFound(): _dictionary[word].Definitions;
    }

    [HttpGet("words/{word}/url")]
    public ActionResult<string> GetUrl(string word)
    {
        word = word.ToLower();
        return _dictionary[word] == null? NotFound(): _dictionary[word].Url;
    }
    
    
    [HttpGet("getAll")]
    public DtoWord[] GetAll()
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
