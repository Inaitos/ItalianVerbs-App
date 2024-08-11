using Newtonsoft.Json;
// ReSharper disable InconsistentNaming

namespace Verbs.Data;

public class VerbsRepository : IVerbsRepository
{
    private readonly Definition[] _definitions;
    private readonly Dictionary<string, Definition> _dictionary;

    public VerbsRepository()
    {
        _definitions = File
            .ReadLines(Path.Combine("data", "italian-verbs.csv"))
            .Select(l=> Path.Combine("data", "content", $"{l.First()}", $"{l}.json")) 
            .Where(File.Exists)
            .Select(ReadFromFile)
            .Where(d=> d.Conjugations != null)
            .DistinctBy(d=> d.Word)
            .ToArray();

        _dictionary = _definitions.ToDictionary(r=> r.Word, r=> r, StringComparer.OrdinalIgnoreCase);
    }
    
    
    private Definition ReadFromFile(string fileName)
    {
        var fileData = File.ReadAllText(fileName);
        var p = JsonConvert.DeserializeObject<Definition>(fileData);
        return p;
    }

    
    public string[] GetWords()
    {
        return _definitions.Select(l => l.Word).ToArray();
    }

    
    public bool TryGetWordDef(string word, out Definition def)
    {
        return _dictionary.TryGetValue(word, out def);
    }

    public bool TryGetConjugation(string word, string group, out Conjugation[] con)
    {
        if (!_dictionary.TryGetValue(word, out var def))
        {
            con = default;
            return false;
        }

        var conjugations = def.Conjugations.Where(l=> l.Group == (group ?? "indicative/present")).ToArray();
        if (conjugations.Length == 0)
        {
            con = default;
            return false;
        }

        con = conjugations;
        return true;
    }
}