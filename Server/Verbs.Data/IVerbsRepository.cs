namespace Verbs.Data;

public interface IVerbsRepository
{
    string[] GetWords();
    bool WordExists(string word);
    Definition GetValue(string word);
    public bool TryGetWordDef(string word, out Definition def);
    Conjugation[] GetConjugation(string word, string group);
    public bool TryGetConjugation(string word, string group, out Conjugation[] con);
    string[] GetDefinition(string word);
    string GetUrl(string word);
    Definition[] GetAll();
    
}