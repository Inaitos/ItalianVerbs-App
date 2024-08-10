namespace Verbs.Data;

public interface IVerbsRepository
{
    string[] GetWords();
    bool WordExists(string word);
    Definition GetValue(string word);
    string[] GetSearch(string word);
    Conjugation[] GetConjugation(string word, string group);
    string[] GetDefinition(string word);
    string GetUrl(string word);
    Definition[] GetAll();
    
}