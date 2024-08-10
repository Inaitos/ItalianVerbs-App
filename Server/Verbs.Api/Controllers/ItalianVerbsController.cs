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

    [HttpGet]
    public string[] Get()
    {
        return _repository.GetWords();
    }

    [HttpGet("words/{word}", Name = "GetWord")]
    public ActionResult<Definition> GetWord(string word)
    {
        //return _dictionary.TryGetValue(word, out var value) == false? NotFound(): value;
        return _repository.WordExists(word) == false ? NotFound() : _repository.GetValue(word);
    }

    [HttpGet("words/search", Name = "getSearch")]
    public ActionResult<string[]> GetSearch([FromQuery] string word)
    {
        return word == null ? NotFound() : _repository.GetSearch(word);
    }

    [HttpGet("words/{word}/conjugation", Name = "GetConj")]
    public ActionResult<Conjugation[]> GetConj(string word, [FromQuery]string group)
    {
        return _repository.WordExists(word) == false ? NotFound() :_repository.GetConjugation(word, group);
        /*return _dictionary[word] == null? NotFound(): _dictionary[word]
                                                        .Conjugations
                                                        .Where(r => r.Group == (group ?? "indicative/present"))
                                                        .ToArray();*/
    }

    [HttpGet("words/{word}/definition", Name = "GetDef")]
    public ActionResult<string[]> GetDef(string word)
    {
        //return _dictionary[word] == null? NotFound(): _dictionary[word].Definitions;
        return _repository.WordExists(word) == false? NotFound() : _repository.GetDefinition(word);
    }

    [HttpGet("words/{word}/url", Name = "GetUrl")]
    public ActionResult<string> GetUrl(string word)
    {
        //return _dictionary[word] == null? NotFound(): _dictionary[word].Url;
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
            .ToDictionary(c => c.Form, c=> c.Value)
            ;
        return new DtoWord(def.Word, i + 1){Conjugations = cDct};
    }

    
}
