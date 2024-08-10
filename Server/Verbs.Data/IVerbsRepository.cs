namespace Verbs.Data;

public interface IVerbsRepository
{
    string[] GetWords();
    bool WordExists(string word);
    Definition GetValue(string word);
    Conjugation[] GetConjugation(string word, string group);
}