using Newtonsoft.Json;

namespace Verbs.Data;

public class VerbsRepository : IVerbsRepository
{
    private Definition[] _definitions;
    private Dictionary<string, Definition> _dictionary;

    public VerbsRepository()
    {
        _definitions = System.IO.File
            .ReadLines(Path.Combine("data", "italian-verbs.csv"))
            .Select(l=> $@".\data\content\{l.First()}\{l}.json")
            .Where(System.IO.File.Exists)
            .Select(fileName => ReadFromFile(fileName))
            .Where(d=> d.Conjugations != null)
            .DistinctBy(d=> d.Word)
            .ToArray();

        _dictionary = _definitions.ToDictionary(r=> r.Word, r=> r, StringComparer.OrdinalIgnoreCase);
    }
    
    private Definition ReadFromFile(string fileName)
    {
        var fileData = System.IO.File.ReadAllText(fileName);
        var p = JsonConvert.DeserializeObject<Definition>(fileData);
        return p;
    }

    public string[] GetWords()
    {
        return _definitions.Select(l => l.Word).ToArray();
    }

    public bool WordExists(string word)
    {
        return _dictionary.TryGetValue(word, out var value);
    }

    public Definition GetValue(string word)
    {
        return _dictionary[word];
    }

    public Conjugation[] GetConjugation(string word, string group)
    {
        return _dictionary[word]
                .Conjugations
                .Where(l=> l.Group == (group ?? "indicative/present"))
                .ToArray();
    }
}