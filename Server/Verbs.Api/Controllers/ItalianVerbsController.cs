using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc;
using Verbs.Data;
using Newtonsoft.Json;
namespace Verbs.Api.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ItalianVerbsController : ControllerBase
{
    private readonly IVerbsRepository _repository;
    
    
    public ItalianVerbsController(IVerbsRepository repository)
    {
        _repository = repository;
    }

    
    [HttpGet(Name = "GetWords")]
    public string[] Get([FromQuery] string word)
    {
        IEnumerable<string> p = _repository.GetWords();
        if (!string.IsNullOrWhiteSpace(word))
        {
            p = p.Where(l => l.Contains(word));
        }

        return p.ToArray();
    }

    
    [HttpGet("words/{word}", Name = "GetWord")]
    public ActionResult<Definition> GetWord(string word)
    {
        return !_repository.TryGetWordDef(word, out var def)? NotFound() : def;
    }
    
    
    [HttpGet("words/{word}/conjugation", Name = "GetConj")]
    public ActionResult<DtoConjugation[]> GetConj(string word, [FromQuery]string group)
    {
        if (!_repository.TryGetConjugation(word, group, out var conj))
        {
            return NotFound();
        }

        var ret = conj.Select(l => new DtoConjugation(l.Value)).ToArray();
        return ret;
    }

    
    [HttpGet("words/{word}/definition", Name = "GetDef")]
    public ActionResult<string[]> GetDef(string word)
    {
        return _repository.WordExists(word) == false? NotFound() : _repository.GetDefinition(word);
    }

    
    [HttpGet("words/{word}/url", Name = "GetUrl")]
    public ActionResult<string> GetUrl(string word)
    {
        return _repository.WordExists(word) == false ? NotFound() : _repository.GetUrl(word);
    }
    
    
    [HttpGet("getAll", Name = "GetAll")]
    public DtoWord[] GetAll()
    {
        var dtow = _repository.GetAll()
            .Select(NewWord)
            .ToArray();
        return dtow;
    }

    private DtoWord NewWord(Definition def, int i)
    {
        var cDct = def
            .Conjugations
            .Where(c => c.Group == "indicative/present")
            .ToDictionary(c => c.Form, c => c.Value);
        return new DtoWord(def.Word, i + 1){Conjugations = cDct};
    }

    
}
