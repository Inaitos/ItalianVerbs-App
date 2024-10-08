﻿using System.Text.Json.Serialization;
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

        var ret = conj.Select(l => new DtoConjugation(l.Form, l.Value)).ToArray();
        return ret;
    }


    [HttpGet("words/{word}/translation", Name = "GetTranslation")]
    public ActionResult<DtoTranslation[]> GetTranslation(string word)
    {
        if (!_repository.TryGetWordDef(word, out var def))
        {
            return NotFound();
        }

        var ret = def.Definitions
                                .Select(l => new DtoTranslation(l))
                                .ToArray();
        return ret;
    }


    [HttpGet("random/{top}/{count}", Name = "GetRandom")]

    public string[] GetRandom(int top, int count)
    {
        var ret = _repository.GetRand(top, count);
        return ret;
    }


    [HttpGet("words/length", Name = "GetLength")]
    public int GetLength()
    {
        return _repository.GetLength();
    }


    [HttpGet("words/conjGroups", Name = "GetGroups")]
    public string[] GetGroups()
    {
        return _repository.GetGroups();
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
